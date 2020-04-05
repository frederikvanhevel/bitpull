import { makeExecutableSchema, IResolvers } from 'graphql-tools'
import { gql } from 'apollo-server'
import { encrypt } from '../resolvers/utility'

const query = gql`
    directive @isAuthenticated on FIELD_DEFINITION

    type Query {
        dummy: String
    }

    type Mutation {
        encrypt(text: String!): String! @isAuthenticated
    }
`
const resolvers: IResolvers = {
    Query: {},
    Mutation: {
        encrypt
    }
}

export default makeExecutableSchema({
    typeDefs: [query],
    resolvers
})
