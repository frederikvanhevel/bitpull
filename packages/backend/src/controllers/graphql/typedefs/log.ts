import { gql } from 'apollo-server'

export const Log = gql`
    enum LogType {
        ERROR
        WARN
        INFO
    }
    type LogEntry {
        date: DateTime!
        type: LogType!
        nodeId: String!
        nodeType: String!
        message: String!
    }
    type Log {
        status: String!
        logs: [LogEntry]!
        workflow: String!
        job: String!
        date: DateTime!
    }
`
