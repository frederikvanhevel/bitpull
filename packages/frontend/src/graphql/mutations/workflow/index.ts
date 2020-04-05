import { omit } from 'ramda'
import { gql } from 'apollo-boost'
import client from 'graphql/apollo-client'
import { toJSON } from 'components/node'
import { GET_WORKFLOWS, Workflow } from 'queries/workflow'
import {
    createWorkflow as CreateWorkflow,
    createWorkflowVariables
} from './typedefs/createWorkflow'
import {
    updateWorkflow as UpdateWorkflow,
    updateWorkflowVariables
} from './typedefs/updateWorkflow'
import {
    removeWorkflow as RemoveWorkflow,
    removeWorkflowVariables
} from './typedefs/removeWorkflow'
import { getWorkflows as getWorkflowsQuery } from 'queries/workflow/typedefs/getWorkflows'

export const CREATE_WORKFLOW = gql`
    mutation createWorkflow($data: WorkflowInput!) {
        createWorkflow(data: $data) {
            id
            name
            updatedAt
        }
    }
`

export const UPDATE_WORKFLOW = gql`
    mutation updateWorkflow($id: String!, $data: WorkflowInput!) {
        updateWorkflow(id: $id, data: $data) {
            id
            name
        }
    }
`

export const REMOVE_WORKFLOW = gql`
    mutation removeWorkflow($id: String!) {
        removeWorkflow(id: $id)
    }
`

export const createWorkflow = (workflow: Workflow) => {
    return client.mutate<CreateWorkflow, createWorkflowVariables>({
        mutation: CREATE_WORKFLOW,
        variables: {
            data: {
                name: workflow.name,
                node: toJSON(workflow.node),
                settings: omit(['__typename'], workflow.settings)
            }
        },
        update: (cache, { data: mutationData }) => {
            if (!mutationData) return

            const data = cache.readQuery<getWorkflowsQuery>({
                query: GET_WORKFLOWS
            })

            if (!data) return

            cache.writeQuery<getWorkflowsQuery>({
                query: GET_WORKFLOWS,
                data: {
                    getWorkflows: [
                        mutationData.createWorkflow,
                        ...data.getWorkflows
                    ]
                }
            })
        }
    })
}

export const updateWorkflow = (workflow: Workflow) => {
    return client.mutate<UpdateWorkflow, updateWorkflowVariables>({
        mutation: UPDATE_WORKFLOW,
        variables: {
            id: workflow.id,
            data: {
                name: workflow.name,
                node: toJSON(workflow.node),
                settings: omit(['__typename'], workflow.settings)
            }
        },
        update: (cache, { data: mutationData }) => {
            if (!mutationData) return

            const data = cache.readQuery<getWorkflowsQuery>({
                query: GET_WORKFLOWS
            })

            if (!data) return

            cache.writeQuery<getWorkflowsQuery>({
                query: GET_WORKFLOWS,
                data: {
                    getWorkflows: data.getWorkflows.map(wf =>
                        wf.id === mutationData.updateWorkflow.id
                            ? { ...wf, ...mutationData.updateWorkflow }
                            : wf
                    )
                }
            })
        }
    })
}

export const removeWorkflow = (id: string) => {
    return client.mutate<RemoveWorkflow, removeWorkflowVariables>({
        mutation: REMOVE_WORKFLOW,
        variables: {
            id
        },
        update: cache => {
            const data = cache.readQuery<getWorkflowsQuery>({
                query: GET_WORKFLOWS
            })

            if (!data) return

            cache.writeQuery<getWorkflowsQuery>({
                query: GET_WORKFLOWS,
                data: {
                    getWorkflows: data.getWorkflows.filter(
                        workflow => workflow.id !== id
                    )
                }
            })
        }
    })
}
