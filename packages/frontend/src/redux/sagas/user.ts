import { put, takeLatest, call } from 'redux-saga/effects'
import client from 'graphql/apollo-client'
import { getCurrentUser } from 'queries/user/typedefs/getCurrentUser'
import { GET_USER } from 'queries/user'
import { FetchResult } from 'apollo-boost'
import UserConstants from 'redux/constants/user'
import {
    Login,
    Register,
    VerifyEmail,
    UpdateInformation,
    OAuth
} from 'actions/user'
import {
    login as loginMutation,
    loginVariables
} from 'mutations/user/typedefs/login'
import { register as registerMutation } from 'mutations/user/typedefs/register'
import { updateInformation as updateInformationMutation } from 'mutations/user/typedefs/updateInformation'
import {
    LOGIN,
    REGISTER,
    REGISTER_WITH_OAUTH,
    VERIFY_EMAIL,
    UPDATE_INFORMATION
} from 'mutations/user'
import { addNotification } from './helper'
import { oAuth, oAuthVariables } from 'mutations/user/typedefs/oAuth'

const LOCALSTORAGE_TOKEN = 'token'

function* loadUser() {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN)

    if (!token) {
        yield put({ type: UserConstants.LOAD_USER_FAILED })
        return
    }

    try {
        const result: FetchResult<getCurrentUser> = yield call(client.query, {
            query: GET_USER
        })

        yield put({
            type: UserConstants.LOAD_USER_SUCCESS,
            payload: result.data?.getCurrentUser
        })
    } catch (error) {
        localStorage.removeItem(LOCALSTORAGE_TOKEN)
        yield put({
            type: UserConstants.LOAD_USER_FAILED,
            payload: error
        })
    }
}

function* login(action: Login) {
    try {
        const result: FetchResult<loginMutation, loginVariables> = yield call(
            client.mutate,
            {
                mutation: LOGIN,
                variables: {
                    data: action.payload
                }
            }
        )
        const { user, token } = result.data!.login

        localStorage.setItem(LOCALSTORAGE_TOKEN, token)

        yield put({
            type: UserConstants.LOGIN_SUCCESS,
            payload: user
        })
    } catch (error) {
        yield put({
            type: UserConstants.LOGIN_FAILED,
            payload: error
        })
    }
}

function* oAuth(action: OAuth) {
    try {
        const result: FetchResult<oAuth, oAuthVariables> = yield call(
            client.mutate,
            {
                mutation: REGISTER_WITH_OAUTH,
                variables: {
                    data: action.payload
                }
            }
        )
        const { user, token } = result.data!.oAuth

        localStorage.setItem(LOCALSTORAGE_TOKEN, token)

        yield put({
            type: UserConstants.OAUTH_SUCCESS,
            payload: user
        })
    } catch (error) {
        yield put({
            type: UserConstants.OAUTH_FAILED,
            payload: error
        })
    }
}

function* register(action: Register) {
    try {
        const result: FetchResult<registerMutation> = yield call(
            client.mutate,
            {
                mutation: REGISTER,
                variables: {
                    data: action.payload
                }
            }
        )
        const { user, token } = result.data!.register

        localStorage.setItem(LOCALSTORAGE_TOKEN, token)

        yield put({
            type: UserConstants.REGISTER_SUCCESS,
            payload: user
        })
    } catch (error) {
        yield put({
            type: UserConstants.REGISTER_FAILED,
            payload: error
        })
    }
}

function* verifyEmail(action: VerifyEmail) {
    try {
        yield call(client.mutate, {
            mutation: VERIFY_EMAIL,
            variables: {
                token: action.payload
            }
        })

        yield put({
            type: UserConstants.VERIFY_EMAIL_SUCCESS
        })

        yield addNotification('success', 'Your email has been verified')
    } catch (error) {
        yield put({
            type: UserConstants.VERIFY_EMAIL_FAILED,
            payload: error
        })

        yield addNotification('error', 'Something went wrong, please try again')
    }
}

function* updateInformation(action: UpdateInformation) {
    try {
        const result: FetchResult<updateInformationMutation> = yield call(
            client.mutate,
            {
                mutation: UPDATE_INFORMATION,
                variables: {
                    data: action.payload
                }
            }
        )

        yield put({
            type: UserConstants.UPDATE_INFORMATION_SUCCESS,
            payload: result.data?.updateInformation
        })

        yield addNotification('success', 'Your information has been updated')
    } catch (error) {
        yield put({
            type: UserConstants.UPDATE_INFORMATION_FAILED,
            payload: error
        })

        yield addNotification('error', 'Unable to update your information')
    }
}

function* logout() {
    localStorage.removeItem(LOCALSTORAGE_TOKEN)
    window.location.href = '/'
}

export default [
    takeLatest(UserConstants.LOAD_USER, loadUser),
    takeLatest(UserConstants.LOGIN, login),
    takeLatest(UserConstants.REGISTER, register),
    takeLatest(UserConstants.OAUTH, oAuth),
    takeLatest(UserConstants.LOGOUT, logout),
    takeLatest(UserConstants.VERIFY_EMAIL, verifyEmail),
    takeLatest(UserConstants.UPDATE_INFORMATION, updateInformation)
]
