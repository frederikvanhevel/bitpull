import { makeExecutableSchema, IResolvers } from 'graphql-tools'
import { gql } from 'apollo-server'
import { GraphQLDateTime } from 'graphql-iso-date'
import {
    getJobs,
    createJob,
    removeJob,
    pauseJob,
    resumeJob,
    getJobLogs
} from '../resolvers/job'
import { Job, JobInput } from '../typedefs/job'
import { Log } from '../typedefs/log'
import { Workflow } from '../typedefs/workflow'
import { Common } from '../typedefs/common'

const query = gql`
    directive @isAuthenticated on FIELD_DEFINITION

    type Query {
        getJobs: [ScheduledJob!]! @isAuthenticated
        getJobLogs(id: String!): Log @isAuthenticated
    }

    type Mutation {
        createJob(input: JobInput!): Job! @isAuthenticated
        removeJob(id: String!): Boolean! @isAuthenticated
        pauseJob(id: String!): Boolean! @isAuthenticated
        resumeJob(id: String!): Boolean! @isAuthenticated
    }
`
const resolvers: IResolvers = {
    DateTime: GraphQLDateTime,
    Query: {
        getJobs,
        getJobLogs
    },
    Mutation: {
        createJob,
        removeJob,
        pauseJob,
        resumeJob
    }
}

export default makeExecutableSchema({
    typeDefs: [Job, JobInput, Log, Workflow, Common, query],
    resolvers
})
