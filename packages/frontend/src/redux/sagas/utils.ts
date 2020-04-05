import { cancel, fork, take, ActionPattern } from 'redux-saga/effects'

function* performTakeUntil(
    startActionType: ActionPattern,
    stopActionType: ActionPattern,
    saga: any
) {
    while (yield take(startActionType)) {
        const watchers = yield fork(saga)
        yield take(stopActionType)
        yield cancel(watchers)
    }
}

export function takeUntil(
    startActionType: ActionPattern,
    stopActionType: ActionPattern,
    saga: any
) {
    return fork(performTakeUntil, startActionType, stopActionType, saga)
}
