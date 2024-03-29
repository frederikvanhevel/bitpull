import { ChildProcess } from 'child_process'
import { GraphQLFieldResolver } from 'graphql'
import { Workflow } from 'models/workflow'
import WorkflowService from 'services/workflow'
import {
    QueryGetWorkflowArgs,
    MutationUpdateWorkflowArgs,
    MutationRemoveWorkflowArgs,
    QueryFetchSiteContentArgs,
    MutationCreateWorkflowArgs,
    QueryRunWorkflowArgs
} from 'typedefs/graphql'
import { NodeEventType } from 'services/workflow/typedefs'
import ProxyTool from 'components/proxy'
import Logger from 'utils/logging/logger'
import { WorkerEvent } from 'components/worker/typedefs'
import StorageService from 'services/storage'
import { ResourceType } from 'models/storage'
import {
    WorkflowInUseError,
    RunnerTimeoutReachedError,
    LimitReachedError
} from 'utils/errors'
import Worker from 'components/worker'
import { limitFollowedLinks } from 'services/workflow/helper'
import Config from 'utils/config'
import Segment, { TrackingEvent } from 'components/segment'
import { AuthenticationContext } from '../directives/auth'
import { pubsub } from '../schema'
import { SubscriptionEvent } from '../typedefs/workflow'
import { Types } from 'mongoose'

export const getWorkflow: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    QueryGetWorkflowArgs
> = async (root, args, context): Promise<Workflow | null> => {
    try {
        return await WorkflowService.getWorkflow(context.user, args.id)
    } catch (error) {
        Logger.throw(new Error('Could not get workflow'), error, context.user)
    }
}

export const getWorkflows: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context): Promise<Workflow[]> => {
    try {
        return await WorkflowService.getWorkflows(context.user)
    } catch (error) {
        Logger.throw(
            new Error('Could not get workflow list'),
            error,
            context.user
        )
    }
}

export const createWorkflow: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    MutationCreateWorkflowArgs
> = async (root, args, context): Promise<Workflow> => {
    try {
        return await WorkflowService.createWorkflow(
            context.user,
            args.data as Workflow
        )
    } catch (error) {
        if (error instanceof LimitReachedError) throw error

        Logger.throw(
            new Error('Could not create workflow'),
            error,
            context.user
        )
    }
}

export const updateWorkflow: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    MutationUpdateWorkflowArgs
> = async (root, args, context) => {
    try {
        const workflowData = args.data as Partial<Workflow>
        return await WorkflowService.updateWorkflow(
            context.user,
            args.id,
            workflowData
        )
    } catch (error) {
        Logger.throw(
            new Error('Could not update workflow'),
            error,
            context.user
        )
    }
}

export const removeWorkflow: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    MutationRemoveWorkflowArgs
> = async (root, args, context): Promise<boolean> => {
    try {
        await WorkflowService.removeWorkflow(context.user, args.id)
        return true
    } catch (error) {
        if (error instanceof WorkflowInUseError) throw error

        Logger.throw(
            new Error('Could not remove workflow'),
            error,
            context.user
        )
    }
}

export const runWorkflow: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    QueryRunWorkflowArgs
> = async (root, args, context) => {
    let childWorkflow: ChildProcess

    const kill = () => {
        Logger.info('Killing worker in resolver')
        try {
            Worker.kill(childWorkflow)
        } catch (error) {
            Logger.error(error)
        }
    }

    try {
        Segment.track(TrackingEvent.WORKFLOW_RUN, context.user, {
            properties: {
                name: args.name
            }
        })

        if (context.req) {
            context.req.setTimeout(Config.RUNNER_TIMEOUT)
            context.req.on('close', kill)
        }

        const handler = (event: NodeEventType | WorkerEvent, data: any) => {
            if (event === WorkerEvent.CREATED) {
                childWorkflow = data
            } else if (event === NodeEventType.STORAGE) {
                StorageService.save(context.user.id, {
                    resourceType: ResourceType.TEST_RUN,
                    resourceName: args.name,
                    data
                }).catch(Logger.error)
            }

            if (Object.values(NodeEventType).includes(event as NodeEventType)) {
                pubsub.publish(SubscriptionEvent.NODE_EVENT, {
                    nodeEvent: {
                        event,
                        data
                    }
                })
            }
        }

        const id = new Types.ObjectId()
        const result = await WorkflowService.run(
            context.user,
            limitFollowedLinks(args.node),
            id.toHexString(),
            args.name,
            ResourceType.TEST_RUN,
            handler,
            false,
            args.watchedNodeId!
        )

        Logger.info(`Worker resolver finished, has result: ${!!result}`)

        if (!result) throw new Error()

        kill()

        return result
    } catch (error) {
        Logger.error(new Error('Error occured in workflow run resolver'), error)
        kill()

        if (error instanceof RunnerTimeoutReachedError) {
            throw error
        } else {
            Logger.throw(
                new Error('Could not run workflow'),
                error,
                context.user
            )
        }
    }
}

export const fetchSiteContent: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    QueryFetchSiteContentArgs
> = async (root, args, context) => {
    try {
        return await ProxyTool.prepareForSelector(args.node)
    } catch (error) {
        Logger.throw(
            new Error('Could not get website content'),
            error,
            context.user
        )
    }
}
