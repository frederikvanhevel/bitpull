import { uuid } from 'uuidv4'
import { Node } from 'typedefs/common'
import {
    SET_CURRENT_WORKFLOW,
    SET_WORKFLOW_NAME,
    CHANGE_WORKFLOW_SETTINGS,
    UPDATE_NODE,
    DELETE_NODE,
    SET_WORKFLOW_RESULT,
    SET_ACTIVE_NODE,
    SET_FAILED_NODE,
    SET_COMPLETED_NODE,
    TOGGLE_WATCHER_SELECT,
    SET_WATCHED_NODE_ID,
    SET_SELECTED_NODE_ID,
    SET_WATCHED_NODE_RESULT,
    SET_HIGHLIGHTED_NODE_ID,
    SAVE_WORKFLOW,
    SAVE_WORKFLOW_COMPLETED,
    SET_WORKFLOW_ID
} from '../constants/workflow'
import { initializeNodes } from 'components/node'
import { NodeType, NodeId } from '@bitpull/worker/lib/typedefs'
import { ParseResult } from '@bitpull/worker/lib/typedefs'
import { Workflow, WorkflowSettings } from 'queries/workflow'
import { RunNode } from './runner'

export interface SetCurrentWorkflow {
    type: typeof SET_CURRENT_WORKFLOW
    payload: Workflow
}

export const setCurrentWorkflow = (workflow: Workflow) => {
    return {
        type: SET_CURRENT_WORKFLOW,
        payload: {
            ...workflow,
            node: initializeNodes(workflow.node)
        }
    }
}

export const createNewWorkflow = () => {
    const NEW_WORKFLOW: Workflow = {
        id: 'new',
        name: 'New workflow',
        settings: {
            useProxy: false
        },
        node: {
            id: uuid(),
            type: NodeType.HTML,
            link: '',
            parseJavascript: true
        }
    }

    return {
        type: SET_CURRENT_WORKFLOW,
        payload: NEW_WORKFLOW
    }
}

export interface SetWorkflowName {
    type: typeof SET_WORKFLOW_NAME
    payload: string
}

export const setWorkflowName = (name: string) => {
    return {
        type: SET_WORKFLOW_NAME,
        payload: name
    }
}

export interface ChangeWorkflowSettings {
    type: typeof CHANGE_WORKFLOW_SETTINGS
    payload: Partial<WorkflowSettings>
}

export const changeWorkflowSettings = (settings: object) => {
    return {
        type: CHANGE_WORKFLOW_SETTINGS,
        payload: settings
    }
}

export interface UpdateNode {
    type: typeof UPDATE_NODE
    payload: Node
}

export const updateNode = (node: Node) => {
    return {
        type: UPDATE_NODE,
        payload: node
    }
}

export interface DeleteNode {
    type: typeof DELETE_NODE
    payload: Node
}

export const deleteNode = (node: Node) => {
    return {
        type: DELETE_NODE,
        payload: node
    }
}

export interface SetWorkflowResult {
    type: typeof SET_WORKFLOW_RESULT
    payload: ParseResult | undefined
}

export const setWorkflowResult = (result?: ParseResult) => {
    return {
        type: SET_WORKFLOW_RESULT,
        payload: result
    }
}

export interface SetActiveNode {
    type: typeof SET_ACTIVE_NODE
    payload: NodeId
}

export const setActiveNode = (nodeId: NodeId) => {
    return {
        type: SET_ACTIVE_NODE,
        payload: nodeId
    }
}

export interface SetFailedNode {
    type: typeof SET_FAILED_NODE
    payload: NodeId
}

export const setFailedNode = (nodeId: NodeId) => {
    return {
        type: SET_FAILED_NODE,
        payload: nodeId
    }
}

export interface SetCompletedNode {
    type: typeof SET_COMPLETED_NODE
    payload: NodeId
}

export const setCompletedNode = (nodeId: NodeId) => {
    return {
        type: SET_COMPLETED_NODE,
        payload: nodeId
    }
}

export interface ToggleWatcherSelect {
    type: typeof TOGGLE_WATCHER_SELECT
}

export const toggleWatcherSelect = () => {
    return {
        type: TOGGLE_WATCHER_SELECT
    }
}

export interface SetWatchedNodeId {
    type: typeof SET_WATCHED_NODE_ID
    payload: NodeId
}

export const setWatchedNodeId = (nodeId?: NodeId) => {
    return {
        type: SET_WATCHED_NODE_ID,
        payload: nodeId
    }
}

export interface SetSelectedNodeId {
    type: typeof SET_SELECTED_NODE_ID
    payload: NodeId
}

export const setSelectedNodeId = (nodeId?: NodeId) => {
    return {
        type: SET_SELECTED_NODE_ID,
        payload: nodeId
    }
}

export interface SetHighlightedNodeId {
    type: typeof SET_HIGHLIGHTED_NODE_ID
    payload: NodeId
}

export const setHighlightedNodeId = (nodeId?: NodeId) => {
    return {
        type: SET_HIGHLIGHTED_NODE_ID,
        payload: nodeId
    }
}

export interface SetWatchedNodeResult {
    type: typeof SET_WATCHED_NODE_RESULT
    payload: any
}

export const setWatchedNodeResult = (data?: any) => {
    return {
        type: SET_WATCHED_NODE_RESULT,
        payload: data
    }
}

export interface SaveCurrentWorkflow {
    type: typeof SAVE_WORKFLOW | typeof SAVE_WORKFLOW_COMPLETED
}

export const saveCurrentWorkflow = () => {
    return {
        type: SAVE_WORKFLOW
    }
}

export interface SetWorkflowId {
    type: typeof SET_WORKFLOW_ID
    payload: string
}

export const setWorkflowId = (id: string) => {
    return {
        type: SET_WORKFLOW_ID,
        payload: id
    }
}

export type Actions =
    | SetCurrentWorkflow
    | SetWorkflowName
    | ChangeWorkflowSettings
    | UpdateNode
    | DeleteNode
    | SetWorkflowResult
    | SetActiveNode
    | SetFailedNode
    | SetCompletedNode
    | ToggleWatcherSelect
    | SetWatchedNodeId
    | SetSelectedNodeId
    | SetWatchedNodeResult
    | SetHighlightedNodeId
    | SaveCurrentWorkflow
    | SetWorkflowId
    | RunNode
