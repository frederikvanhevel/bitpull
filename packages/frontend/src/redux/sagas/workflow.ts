import { takeLatest, select, put, call } from 'redux-saga/effects'
import {
    UPDATE_NODE,
    DELETE_NODE,
    SAVE_WORKFLOW,
    SAVE_WORKFLOW_COMPLETED,
    SET_WORKFLOW_ID
} from 'redux/constants/workflow'
import { UpdateNode, setCurrentWorkflow } from 'actions/workflow'
import { updateNodesObject } from 'components/node'
import { AppState } from 'redux/store'
import { Workflow } from 'queries/workflow'
import { history } from 'pages/router'
import { createWorkflow, updateWorkflow } from 'mutations/workflow'
import { addNotification } from './helper'
import { getError } from 'utils/errors'

function* saveCurrentWorkflow() {
    const currentWorkflow: Workflow = yield select(
        (state: AppState) => state.workflow.currentWorkflow
    )

    if (!currentWorkflow) return

    try {
        if (currentWorkflow.id === 'new') {
            const result = yield call(createWorkflow, currentWorkflow)
            yield addNotification(
                'success',
                'Created new workflow successfully!'
            )
            yield put({
                type: SET_WORKFLOW_ID,
                payload: result.data.createWorkflow.id
            })
            history.replace(`/workflow/${result.data.createWorkflow.id}`)
        } else {
            yield call(updateWorkflow, currentWorkflow)
            yield addNotification('success', 'Saved workflow successfully!')
        }

        yield put({ type: SAVE_WORKFLOW_COMPLETED })
    } catch (error) {
        yield addNotification('error', getError(error))
    }
}

function* updateNode(action: UpdateNode) {
    const currentWorkflow = yield select(
        (state: AppState) => state.workflow.currentWorkflow
    )

    if (!currentWorkflow) return

    const newNodeObject = updateNodesObject({
        nodeToUpdate: currentWorkflow.node,
        updatedNode: action.payload
    })

    yield put(
        setCurrentWorkflow({
            ...currentWorkflow,
            node: newNodeObject
        })
    )
}

function* deleteNode(action: UpdateNode) {
    const currentWorkflow = yield select(
        (state: AppState) => state.workflow.currentWorkflow
    )

    if (!currentWorkflow) return

    const newNodeObject = updateNodesObject({
        nodeToUpdate: currentWorkflow.node,
        nodeIdsToDelete: [action.payload.id]
    })

    yield put(
        setCurrentWorkflow({
            ...currentWorkflow,
            node: newNodeObject
        })
    )
}

export default [
    takeLatest(SAVE_WORKFLOW, saveCurrentWorkflow),
    takeLatest(UPDATE_NODE, updateNode),
    takeLatest(DELETE_NODE, deleteNode)
]
