import { makeExecutableSchema, IResolvers } from 'graphql-tools'
import { GraphQLJSONObject } from 'graphql-type-json'
import { gql } from 'apollo-server'
import {
    Workflow,
    WorkflowInput,
    SubscriptionEvent,
    WorkflowEvent,
    WorkflowResult
} from '../typedefs/workflow'
import {
    getWorkflow,
    getWorkflows,
    createWorkflow,
    updateWorkflow,
    removeWorkflow,
    runWorkflow,
    fetchSiteContent
} from '../resolvers/workflow'
import { Common } from '../typedefs/common'
import { pubsub } from '.'

const query = gql`
    directive @isAuthenticated on FIELD_DEFINITION

    type Query {
        getWorkflow(id: String!): Workflow! @isAuthenticated
        getWorkflows: [Workflow!]! @isAuthenticated
        runWorkflow(
            node: JSONObject
            name: String!
            watchedNodeId: String
        ): WorkflowResult! @isAuthenticated
        fetchSiteContent(url: String!): String! @isAuthenticated
    }

    type Mutation {
        createWorkflow(data: WorkflowInput!): Workflow! @isAuthenticated
        updateWorkflow(id: String!, data: WorkflowInput!): Workflow!
            @isAuthenticated
        removeWorkflow(id: String!): Boolean! @isAuthenticated
    }

    type Subscription {
        nodeEvent: WorkflowEvent
    }
`

const resolvers: IResolvers = {
    JSONObject: GraphQLJSONObject,
    Query: {
        getWorkflow,
        getWorkflows,
        runWorkflow,
        fetchSiteContent
    },
    Mutation: {
        createWorkflow,
        updateWorkflow,
        removeWorkflow
    },
    Subscription: {
        nodeEvent: {
            subscribe: () => pubsub.asyncIterator(SubscriptionEvent.NODE_EVENT)
        }
    }
}

export default makeExecutableSchema({
    typeDefs: [
        Workflow,
        WorkflowInput,
        WorkflowEvent,
        WorkflowResult,
        Common,
        query
    ],
    resolvers
})
