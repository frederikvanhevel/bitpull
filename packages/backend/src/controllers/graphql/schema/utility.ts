import { makeExecutableSchema, IResolvers } from 'graphql-tools'
import { gql } from 'apollo-server'
import { encrypt, feedback } from '../resolvers/utility'

const query = gql`
    directive @isAuthenticated on FIELD_DEFINITION
    directive @RateLimit on FIELD_DEFINITION

    type Query {
        dummy: String
    }

    type Mutation {
        encrypt(text: String!): String! @isAuthenticated
        feedback(type: String!, question: String!): Boolean! @isAuthenticated @RateLimit
    }
`
const resolvers: IResolvers = {
    Query: {},
    Mutation: {
        encrypt,
        feedback
    }
}

export default makeExecutableSchema({
    typeDefs: [query],
    resolvers
})
