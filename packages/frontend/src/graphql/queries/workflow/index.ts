import { gql } from 'apollo-boost'

export const GET_WORKFLOW = gql`
    query getWorkflow($id: String!) {
        getWorkflow(id: $id) {
            id
            name
            node
            settings {
                useProxy
            }
        }
    }
`

export const GET_WORKFLOWS = gql`
    query getWorkflows {
        getWorkflows {
            id
            name
            updatedAt
        }
    }
`

export const RUN_WORKFLOW = gql`
    query runWorkflow(
        $node: JSONObject!
        $name: String!
        $watchedNodeId: String
    ) {
        runWorkflow(node: $node, name: $name, watchedNodeId: $watchedNodeId) {
            status
            errors {
                date
                nodeId
                nodeType
                message
                code
            }
            logs {
                type
                date
                nodeId
                nodeType
                message
            }
        }
    }
`

export const GET_SITE_CONTENT = gql`
    query fetchSiteContent($node: JSONObject!) {
        fetchSiteContent(node: $node)
    }
`

export * from './typedefs'
