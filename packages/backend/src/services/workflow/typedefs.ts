import { NodeId, LogType, NodeType, StorageObject } from '@bitpull/worker'

export enum NodeEventType {
    START = 'START',
    COMPLETE = 'COMPLETE',
    ERROR = 'ERROR',
    WATCH = 'WATCH',
    LOG = 'LOG',
    STORAGE = 'STORAGE'
}

export interface StartEvent {
    nodeId: NodeId
    nodeType: NodeType
}

export interface CompleteEvent {
    nodeId: NodeId
    nodeType: NodeType
}

export interface ErrorEvent {
    nodeId: NodeId
    nodeType: NodeType
    error: string
    code?: string
}

export interface WatchEvent {
    data: object | object[]
}

export interface LogEvent {
    nodeId: NodeId
    nodeType: NodeType
    logType: LogType
    message: string
}

export interface StorageEvent {
    data: StorageObject
}

export type EventData =
    | StartEvent
    | CompleteEvent
    | ErrorEvent
    | WatchEvent
    | LogEvent
    | StorageEvent

export type NodeEventHandler = (event: NodeEventType, data: EventData) => void
