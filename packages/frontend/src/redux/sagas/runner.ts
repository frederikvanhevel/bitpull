import { eventChannel, channel } from 'redux-saga'
import {
    takeLatest,
    take,
    select,
    put,
    call,
    fork,
    cancel
} from 'redux-saga/effects'
import { SET_WORKFLOW_RESULT } from 'redux/constants/workflow'
import {
    setWorkflowResult,
    setActiveNode,
    setCompletedNode,
    setFailedNode,
    setWatchedNodeResult
} from 'actions/workflow'
import { toJSON } from 'components/node'
import { AppState } from 'redux/store'
import client from 'graphql/apollo-client'
import { RUN_WORKFLOW, WorkflowResult } from 'queries/workflow'
import { NODE_SUBSCRIPTION } from 'subscriptions/workflow'
import { Status } from '@bitpull/worker/lib/typedefs'
import { nodeEvent_nodeEvent as NodeEvent } from 'subscriptions/workflow/typedefs/nodeEvent'
import { NodeEvent as NodeEventType } from 'typedefs/graphql'
import { addNotification } from './helper'
import { runWorkflow } from 'queries/workflow/typedefs/runWorkflow'
import { FetchResult, ApolloError } from 'apollo-boost'
import { RUN_NODE, RUN_NODE_CANCEL } from 'redux/constants/runner'
import { storageItemAdded } from 'actions/storage'
import Segment, { TrackingEvent } from 'services/segment'

const resultsChannel = channel()
const errorChannel = channel()
let runnerObservable: ZenObservable.Subscription

function* startRunner() {
    const runNodeFork = yield fork(watchResult)
    const watchNodeEventsFork = yield fork(watchNodeEvents)
    const watchErrorFork = yield fork(watchErrors)
    const workflow = yield select((state: AppState) => state.workflow)
    const node = toJSON(workflow.currentWorkflow.node)

    runnerObservable = client
        .watchQuery({
            query: RUN_WORKFLOW,
            fetchPolicy: 'no-cache',
            variables: {
                node,
                name: workflow.currentWorkflow.name,
                watchedNodeId: workflow.watchedNodeId
            }
        })
        .subscribe(
            (result: FetchResult<runWorkflow>) => {
                resultsChannel.put(result.data?.runWorkflow)
            },
            (error: ApolloError) => {
                errorChannel.put({ error })
            }
        )

    yield take(SET_WORKFLOW_RESULT)
    yield cancel(runNodeFork)
    yield cancel(watchNodeEventsFork)
    yield cancel(watchErrorFork)
    runnerObservable && runnerObservable.unsubscribe()
}

function* watchResult() {
    while (true) {
        const data: WorkflowResult = yield take(resultsChannel)

        if (!data) return

        if (data.errors.length) {
            yield addNotification('warning', 'Workflow completed with errors')
        } else if (data.status === Status.SUCCESS) {
            yield addNotification('success', 'Workflow completed successfully')
        }

        yield put(setWorkflowResult(data as any))
    }
}

function* watchErrors() {
    while (true) {
        const { error } = yield take(errorChannel)

        try {
            yield addNotification('error', error.graphQLErrors[0].message)
        } catch (err) {
            yield addNotification(
                'error',
                'Something went wrong, please try again later.'
            )
        }

        yield put(setWorkflowResult(undefined))
    }
}

function* cancelRunner() {
    runnerObservable && runnerObservable.unsubscribe()
    yield put(setWorkflowResult(undefined))
    Segment.track(TrackingEvent.WORKFLOW_CANCEL_RUN)
}

function nodeEventsChannel() {
    return eventChannel(emitter => {
        const subscription = client
            .subscribe({
                query: NODE_SUBSCRIPTION
            })
            .subscribe({
                next(data) {
                    emitter(data.data.nodeEvent)
                }
            })
        return subscription.unsubscribe
    })
}

function* watchNodeEvents() {
    const eventsChannel = yield call(nodeEventsChannel)

    while (true) {
        const { data, event }: NodeEvent = yield take(eventsChannel)

        switch (event) {
            case NodeEventType.START:
                yield put(setActiveNode(data.nodeId))
                break
            case NodeEventType.ERROR:
                yield put(setFailedNode(data.nodeId))
                yield addNotification('error', data.error, data.code)
                break
            case NodeEventType.COMPLETE:
                yield put(setCompletedNode(data.nodeId))
                break
            case NodeEventType.WATCH:
                yield put(setWatchedNodeResult(data.result))
                break
            case NodeEventType.STORAGE:
                yield put(storageItemAdded())
                break
        }
    }
}

export default [
    takeLatest(RUN_NODE, startRunner),
    takeLatest(RUN_NODE_CANCEL, cancelRunner)
]
