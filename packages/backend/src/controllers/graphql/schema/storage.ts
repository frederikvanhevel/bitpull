import { makeExecutableSchema, IResolvers } from 'graphql-tools'
import { gql } from 'apollo-server'
import { GraphQLDateTime } from 'graphql-iso-date'
import { getStorageEntry, getStorageEntries } from '../resolvers/storage'
import { Storage } from '../typedefs/storage'
import { Common } from '../typedefs/common'

const query = gql`
    directive @isAuthenticated on FIELD_DEFINITION

    type Query {
        getStorageEntry(id: String!, offset: Int, limit: Int): [StorageLink!]!
            @isAuthenticated
        getStorageEntries(resourceType: ResourceType!): [Storage!]!
            @isAuthenticated
    }
`
const resolvers: IResolvers = {
    DateTime: GraphQLDateTime,
    Query: {
        getStorageEntry,
        getStorageEntries
    }
}

export default makeExecutableSchema({
    typeDefs: [query, Storage, Common],
    resolvers
})
