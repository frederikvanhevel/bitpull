import { makeExecutableSchema, IResolvers } from 'graphql-tools'
import { gql } from 'apollo-server'
import {
    hasPaymentMethod,
    updatePayment,
    getPaymentDetails,
    getInvoices,
    getUsageSummary,
    changePlan,
    cancelPlan
} from '../resolvers/payment'
import {
    TokenInput,
    PaymentDetails,
    Invoice,
    UsageSummary
} from '../typedefs/payment'
import { Common } from '../typedefs/common'

const query = gql`
    directive @isAuthenticated on FIELD_DEFINITION

    type Query {
        hasPaymentMethod: Boolean! @isAuthenticated
        getPaymentDetails: PaymentDetails! @isAuthenticated
        getInvoices: [Invoice!]! @isAuthenticated
        getUsageSummary: UsageSummary @isAuthenticated
    }

    type Mutation {
        updatePayment(input: TokenInput!): Boolean!
        changePlan(plan: Plan!): Boolean!
        cancelPlan: Boolean!
    }
`
const resolvers: IResolvers = {
    Query: {
        hasPaymentMethod,
        getPaymentDetails,
        getInvoices,
        getUsageSummary
    },
    Mutation: {
        updatePayment,
        changePlan,
        cancelPlan
    }
}

export default makeExecutableSchema({
    typeDefs: [
        TokenInput,
        PaymentDetails,
        Invoice,
        UsageSummary,
        Common,
        query
    ],
    resolvers
})
