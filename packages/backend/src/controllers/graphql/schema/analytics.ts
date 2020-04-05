import { makeExecutableSchema, IResolvers } from 'graphql-tools'
import { gql } from 'apollo-server'
import { GraphQLDateTime } from 'graphql-iso-date'
import { AnalyticsPeriod, AnalyticsResponse } from '../typedefs/analytics'
import { getTotalsPerDay, getTotalsPerJob } from '../resolvers/analytics'
import { Job } from '../typedefs/job'
import { Workflow } from '../typedefs/workflow'
import { Common } from '../typedefs/common'

const query = gql`
    directive @isAuthenticated on FIELD_DEFINITION

    type Query {
        getTotalsPerDay(period: AnalyticsPeriod!): [TotalsPerDay!]!
            @isAuthenticated
        getTotalsPerJob(period: AnalyticsPeriod!): [TotalsPerJob!]!
            @isAuthenticated
    }
`
const resolvers: IResolvers = {
    DateTime: GraphQLDateTime,
    Query: {
        getTotalsPerDay,
        getTotalsPerJob
    }
}

export default makeExecutableSchema({
    typeDefs: [
        AnalyticsPeriod,
        AnalyticsResponse,
        Job,
        Workflow,
        Common,
        query
    ],
    resolvers
})
