import { put, takeLatest, call } from 'redux-saga/effects'
import client from 'graphql/apollo-client'
import { FetchResult } from 'apollo-boost'
import { UpdateSettings } from 'actions/settings'
import { UPDATE_SETTINGS } from 'mutations/user'
import { updateSettings } from 'mutations/user/typedefs/updateSettings'
import SettingsConstants from 'redux/constants/settings'
import { addNotification } from './helper'

function* updateUserSettings(action: UpdateSettings) {
    try {
        const result: FetchResult<updateSettings> = yield call(client.mutate, {
            mutation: UPDATE_SETTINGS,
            variables: {
                settings: action.payload
            }
        })

        if (!result.data?.updateSettings) throw new Error()

        yield put({
            type: SettingsConstants.UPDATE_SETTINGS_SUCCESS
        })
    } catch (error) {
        yield put({
            type: SettingsConstants.UPDATE_SETTINGS_FAILED,
            payload: action.current
        })
        yield addNotification('error', 'Unable to update your settings')
    }
}

export default [
    takeLatest(SettingsConstants.UPDATE_SETTINGS, updateUserSettings)
]
