import { gql } from 'apollo-server'

export const Workflow = gql`
    type WorkflowSettings {
        useProxy: Boolean!
    }
    type Workflow {
        id: String!
        name: String!
        owner: String!
        node: JSONObject!
        settings: WorkflowSettings!
        updatedAt: DateTime!
        createdAt: DateTime!
    }
`

export const WorkflowInput = gql`
    input WorkflowSettingsInput {
        useProxy: Boolean!
    }
    input WorkflowInput {
        name: String!
        node: JSONObject!
        settings: WorkflowSettingsInput!
    }
`

export const WorkflowEvent = gql`
    enum NodeEvent {
        START
        COMPLETE
        ERROR
        WATCH
        STORAGE
    }
    type WorkflowEvent {
        event: NodeEvent!
        data: JSONObject
    }
`

export enum SubscriptionEvent {
    NODE_EVENT = 'NODE_EVENT'
}

export const WorkflowResult = gql`
    enum LogType {
        INFO
        WARN
        ERROR
    }
    enum Status {
        SUCCESS
        PARTIAL_SUCCESS
        ERROR
    }
    type File {
        service: String!
        fileName: String!
        url: String!
        contentType: String!
        createdAt: DateTime!
    }
    type LogEntry {
        type: LogType!
        date: DateTime!
        nodeId: String!
        nodeType: String!
        message: String!
    }
    type ErrorEntry {
        nodeId: String!
        nodeType: String!
        date: DateTime!
        message: String!
        code: String
    }
    type WorkflowResult {
        status: Status!
        errors: [ErrorEntry!]!
        files: [File]!
        logs: [LogEntry!]!
    }
`
