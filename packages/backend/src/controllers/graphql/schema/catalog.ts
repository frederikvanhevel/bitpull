import { makeExecutableSchema, IResolvers } from 'graphql-tools'
import { GraphQLJSONObject } from 'graphql-type-json'
import { gql } from 'apollo-server'
import {
    getCatalogItems,
    addCatalogItem,
    pickCatalogItem
} from '../resolvers/catalog'
import { CatalogItem, CatalogItemInput } from '../typedefs/catalog'
import { Workflow } from '../typedefs/workflow'
import { Common } from '../typedefs/common'

const query = gql`
    directive @isAuthenticated on FIELD_DEFINITION
    directive @isSuperuser on FIELD_DEFINITION

    type Query {
        getCatalogItems: [CatalogItem!]! @isAuthenticated
    }

    type Mutation {
        addCatalogItem(data: CatalogItemInput!): CatalogItem! @isSuperuser
        pickCatalogItem(id: String!): Workflow! @isAuthenticated
    }
`

const resolvers: IResolvers = {
    JSONObject: GraphQLJSONObject,
    Query: {
        getCatalogItems
    },
    Mutation: {
        addCatalogItem,
        pickCatalogItem
    }
}

export default makeExecutableSchema({
    typeDefs: [CatalogItem, CatalogItemInput, Workflow, Common, query],
    resolvers
})
