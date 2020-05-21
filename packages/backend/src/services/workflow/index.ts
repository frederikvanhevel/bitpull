import WorkflowModel, { Workflow } from 'models/workflow'
import {
    NotAllowedError,
    NotFoundError,
    WorkflowInUseError,
    LimitReachedError
} from 'utils/errors'
import { FlowNode, NodeType, Settings, StorageProvider } from '@bitpull/worker'
import { Integration } from 'models/integration'
import IntegrationService from 'services/integration'
import JobModel from 'models/job'
import { WorkerArgs } from 'components/worker/typedefs'
import Worker from 'components/worker'
import { User } from 'models/user'
import Segment, { TrackingEvent } from 'components/segment'
import { ResourceType } from 'models/storage'
import { getTraceId } from 'utils/logging/tracing'
import Config from 'utils/config'
import { NodeEventHandler } from './typedefs'

const WORKFLOW_LIMIT =
    Config.NODE_ENV === 'production' ? 50 : Number.POSITIVE_INFINITY
export const DEFAULT_TIMEOUT = 5400 * 1000 // 90mins

const getWorkflow = async (user: User, id: string) => {
    const workflow = await WorkflowModel.findById(id)

    if (!workflow) {
        throw new NotFoundError()
    }

    if (!workflow.owner.equals(user.id)) {
        throw new NotAllowedError()
    }

    return workflow
}

const getWorkflows = async (user: User) => {
    return await WorkflowModel.find({
        owner: user._id
    }).sort({ updatedAt: -1 })
}

const createWorkflow = async (user: User, workflowData: Partial<Workflow>) => {
    const count = await WorkflowModel.countDocuments({
        owner: user._id
    })

    if (count >= WORKFLOW_LIMIT) {
        throw new LimitReachedError()
    }

    const newWorkflow = new WorkflowModel({
        ...workflowData,
        owner: user._id
    })

    Segment.track(TrackingEvent.WORKFLOW_CREATE, user)

    return await newWorkflow.save()
}

const updateWorkflow = async (
    user: User,
    workflowId: string,
    data: Partial<Workflow>
) => {
    Segment.track(TrackingEvent.WORKFLOW_UPDATE, user)

    return await WorkflowModel.findOneAndUpdate(
        {
            _id: workflowId,
            owner: user._id
        },
        { ...data, updatedAt: new Date() },
        { new: true }
    )
}

const removeWorkflow = async (user: User, workflowId: string) => {
    const workflowToRemove = await WorkflowModel.findById(workflowId)

    if (!workflowToRemove) {
        throw new NotFoundError()
    }

    if (!workflowToRemove.owner.equals(user.id)) {
        throw new NotAllowedError()
    }

    const jobs = await JobModel.find({ workflow: workflowToRemove._id })

    if (jobs.length) {
        throw new WorkflowInUseError()
    }

    Segment.track(TrackingEvent.WORKFLOW_REMOVE, user)

    return await workflowToRemove.remove()
}

const INTEGRATION_TYPES = [
    NodeType.SLACK,
    NodeType.DROPBOX,
    NodeType.GOOGLE_DRIVE,
    NodeType.ONEDRIVE,
    NodeType.GITHUB
]

const hasIntegrations = (node: FlowNode): boolean => {
    let result = false

    const check = (node: FlowNode) => {
        if (result || INTEGRATION_TYPES.includes(node.type)) {
            result = true
            return
        }

        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                check(node.children[i])
            }
        }
    }

    check(node)

    return result
}

const run = async (
    user: User,
    node: FlowNode,
    id: string,
    name: string,
    resourceType: ResourceType,
    handler?: NodeEventHandler,
    watchedNodeId?: string
) => {
    let integrations: Integration[] = []
    if (hasIntegrations(node)) {
        integrations = await IntegrationService.getUpdatedIntegrations(user.id)
    }

    const settings: Settings = {
        puppeteer: {
            endpoint: Config.PUPPETEER_ENDPOINT!
        },
        proxyEndpoint: `${Config.API_URL}/api/proxy?url=`,
        storage: {
            provider: StorageProvider.AMAZON,
            credentials: {
                bucket: Config.AWS_S3_BUCKET,
                accessKeyId: Config.AWS_ACCESS_KEY_ID,
                secretAccessKey: Config.AWS_SECRET_ACCESS_KEY
            }
        },
        email: {
            apiKey: Config.SENDGRID_API_KEY,
            template: 'd-165400b378b440dcbbc555b491291dbb',
            to: user.email
        },
        encryption: {
            version: 'v1',
            key: Config.ENCRYPTION_KEY
        },
        metaData: {
            id,
            name,
            isJob: resourceType === ResourceType.JOB,
        },
        traceId: getTraceId()
    }

    const workerArgs: WorkerArgs = {
        node,
        options: {
            settings,
            integrations,
            watchedNodeId
        },
        timeout:
            resourceType === ResourceType.TEST_RUN
                ? Config.RUNNER_TIMEOUT
                : DEFAULT_TIMEOUT
    }

    return await Worker.runWorkflow(workerArgs, (event, result) => {
        handler && handler(event, result)
    })
}

const WorkflowService = {
    getWorkflow,
    getWorkflows,
    createWorkflow,
    updateWorkflow,
    removeWorkflow,
    run,
    hasIntegrations
}

export default WorkflowService
