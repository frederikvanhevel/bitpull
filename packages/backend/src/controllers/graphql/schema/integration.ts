import { makeExecutableSchema, IResolvers } from 'graphql-tools'
import { gql } from 'apollo-server'
import { GraphQLJSONObject } from 'graphql-type-json'
import {
    Integration,
    IntegrationInput,
    IntegrationSettings,
    IntegrationSettingsInput,
    SlackChannel,
    GithubRepository
} from '../typedefs/integration'
import {
    getActiveIntegrations,
    updateIntegration,
    removeIntegration,
    toggleIntegration,
    authorize,
    getSlackChannels,
    getGithubRepositories
} from '../resolvers/integration'

const query = gql`
    directive @isAuthenticated on FIELD_DEFINITION

    type Query {
        getActiveIntegrations: [Integration!]! @isAuthenticated
        getSlackChannels: [SlackChannel!]! @isAuthenticated
        getGithubRepositories: [GithubRepository!]! @isAuthenticated
    }

    type Mutation {
        updateIntegration(id: String!, data: IntegrationInput!): Integration!
            @isAuthenticated
        removeIntegration(id: String!): Boolean! @isAuthenticated
        toggleIntegration(id: String!, enabled: Boolean!): Boolean!
            @isAuthenticated
        authorize(type: IntegrationType!, data: JSONObject!): Boolean!
            @isAuthenticated
    }
`
const resolvers: IResolvers = {
    JSONObject: GraphQLJSONObject,
    Query: {
        getActiveIntegrations,
        getSlackChannels,
        getGithubRepositories
    },
    Mutation: {
        updateIntegration,
        removeIntegration,
        toggleIntegration,
        authorize
    }
}

export default makeExecutableSchema({
    typeDefs: [
        query,
        Integration,
        IntegrationSettings,
        IntegrationInput,
        IntegrationSettingsInput,
        SlackChannel,
        GithubRepository
    ],
    resolvers
})
