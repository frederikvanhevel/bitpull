import { Actions } from '../actions/workflow'
import {
    SET_CURRENT_WORKFLOW,
    SET_WORKFLOW_NAME,
    SET_WORKFLOW_RESULT,
    SET_ACTIVE_NODE,
    SET_FAILED_NODE,
    SET_COMPLETED_NODE,
    TOGGLE_WATCHER_SELECT,
    SET_WATCHED_NODE_ID,
    SET_SELECTED_NODE_ID,
    SET_WATCHED_NODE_RESULT,
    SET_HIGHLIGHTED_NODE_ID,
    SET_WORKFLOW_ID,
    SAVE_WORKFLOW,
    UPDATE_NODE,
    CHANGE_WORKFLOW_SETTINGS,
    DELETE_NODE
} from 'redux/constants/workflow'
import { ParseResult } from '@bitpull/worker/lib/typedefs'
import { NodeId } from '@bitpull/worker/lib/typedefs'
import { Workflow } from 'queries/workflow'
import { RUN_NODE } from 'redux/constants/runner'

export interface WorkflowState {
    currentWorkflow?: Workflow
    result?: ParseResult
    running: boolean
    activeNodes: NodeId[]
    failedNodes: NodeId[]
    isSelectingWatcher: boolean
    watchedNodeId?: NodeId
    watchedNodeResult?: any
    highlightedNodeId?: NodeId
    selectedNodeId?: NodeId
    hasUnsavedChanges: boolean
}

const initialState: WorkflowState = {
    running: false,
    activeNodes: [],
    failedNodes: [],
    isSelectingWatcher: false,
    hasUnsavedChanges: false
}

export default (state = initialState, action: Actions): WorkflowState => {
    switch (action.type) {
        case SET_CURRENT_WORKFLOW:
            return {
                ...(state.currentWorkflow?.id === action.payload.id
                    ? state
                    : initialState),
                currentWorkflow: action.payload
            }
        case SET_WORKFLOW_NAME:
            return {
                ...state,
                currentWorkflow:
                    {
                        ...state.currentWorkflow,
                        name: action.payload
                    } as Workflow,
                hasUnsavedChanges: true
            }
        case CHANGE_WORKFLOW_SETTINGS:
            return {
                ...state,
                currentWorkflow:
                    {
                        ...state.currentWorkflow,
                        settings: {
                            ...state.currentWorkflow!.settings,
                            ...action.payload
                        }
                    } as Workflow,
                hasUnsavedChanges: true
            }
        case RUN_NODE:
            return {
                ...state,
                running: true,
                isSelectingWatcher: false,
                activeNodes: [],
                failedNodes: []
            }
        case SET_WORKFLOW_RESULT:
            return {
                ...state,
                result: action.payload,
                running: false,
                activeNodes: []
            }
        case SET_ACTIVE_NODE:
            return {
                ...state,
                activeNodes: state.activeNodes.includes(action.payload)
                    ? state.activeNodes
                    : [...state.activeNodes, action.payload]
            }
        case SET_COMPLETED_NODE:
            return {
                ...state,
                activeNodes: state.activeNodes.filter(
                    id => id !== action.payload
                )
            }
        case SET_FAILED_NODE:
            return {
                ...state,
                failedNodes: [...state.failedNodes, action.payload]
            }
        case TOGGLE_WATCHER_SELECT:
            return {
                ...state,
                isSelectingWatcher: !state.isSelectingWatcher
            }
        case SET_WATCHED_NODE_ID:
            return {
                ...state,
                watchedNodeId: action.payload
            }
        case SET_SELECTED_NODE_ID:
            return {
                ...state,
                selectedNodeId: action.payload
            }
        case SET_WATCHED_NODE_RESULT:
            return {
                ...state,
                watchedNodeResult: action.payload
            }
        case SET_HIGHLIGHTED_NODE_ID:
            return {
                ...state,
                highlightedNodeId: action.payload
            }
        case SET_WORKFLOW_ID:
            return {
                ...state,
                currentWorkflow:
                    {
                        ...state.currentWorkflow,
                        id: action.payload
                    } as Workflow
            }
        case UPDATE_NODE:
            return {
                ...state,
                hasUnsavedChanges: true
            }
        case DELETE_NODE:
            return {
                ...state,
                hasUnsavedChanges: true
            }
        case SAVE_WORKFLOW:
            return {
                ...state,
                hasUnsavedChanges: false
            }
        default:
            return state
    }
}
