import { put } from 'redux-saga/effects'
import { ADD_NOTIFICATION } from 'redux/constants/layout'
import { NotificationAction } from 'reducers/layout'
import { VariantType } from 'notistack'

export function* addNotification(
    type: VariantType,
    message: string,
    action?: NotificationAction
) {
    yield put({
        type: ADD_NOTIFICATION,
        payload: {
            type,
            message,
            action
        }
    })
}
