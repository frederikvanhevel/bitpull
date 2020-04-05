import UserConstants from '../constants/user'
import { User } from 'queries/user/typedefs'
import {
    LoginUserInput,
    RegisterUserInput,
    UpdateUserInput,
    OAuthInput
} from 'typedefs/graphql'

export interface LoadUser {
    type: typeof UserConstants.LOAD_USER
}

export const loadUser = () => {
    return {
        type: UserConstants.LOAD_USER
    }
}

export interface LoadUserSuccess {
    type: typeof UserConstants.LOAD_USER_SUCCESS
    payload: User
}

export interface LoadUserFailed {
    type: typeof UserConstants.LOAD_USER_FAILED
    payload: Error
}

export interface Login {
    type: typeof UserConstants.LOGIN
    payload: LoginUserInput
}

export interface LoginFailed {
    type: typeof UserConstants.LOGIN_FAILED
    payload: Error
}

export interface LoginSuccess {
    type: typeof UserConstants.LOGIN_SUCCESS
    payload: User
}

export const login = (data: LoginUserInput) => {
    return {
        type: UserConstants.LOGIN,
        payload: data
    }
}

export interface OAuth {
    type: typeof UserConstants.OAUTH
    payload: OAuthInput
}

export interface OAuthFailed {
    type: typeof UserConstants.OAUTH_FAILED
    payload: Error
}

export interface OAuthSuccess {
    type: typeof UserConstants.OAUTH_SUCCESS
    payload: User
}

export const oAuth = (data: OAuthInput) => {
    return {
        type: UserConstants.OAUTH,
        payload: data
    }
}

export interface Register {
    type: typeof UserConstants.REGISTER
    payload: LoginUserInput
}

export interface RegisterFailed {
    type: typeof UserConstants.REGISTER_FAILED
    payload: Error
}

export interface RegisterSuccess {
    type: typeof UserConstants.REGISTER_SUCCESS
    payload: User
}

export const register = (data: RegisterUserInput) => {
    return {
        type: UserConstants.REGISTER,
        payload: data
    }
}

export interface VerifyEmail {
    type: typeof UserConstants.VERIFY_EMAIL
    payload: LoginUserInput
}

export interface VerifyEmailFailed {
    type: typeof UserConstants.VERIFY_EMAIL_FAILED
    payload: Error
}

export interface VerifyEmailSuccess {
    type: typeof UserConstants.VERIFY_EMAIL_SUCCESS
    payload: User
}

export const verifyEmail = (token: string) => {
    return {
        type: UserConstants.VERIFY_EMAIL,
        payload: token
    }
}

export interface UpdateInformation {
    type: typeof UserConstants.UPDATE_INFORMATION
    payload: UpdateUserInput
}

export interface UpdateInformationFailed {
    type: typeof UserConstants.UPDATE_INFORMATION_FAILED
    payload: Error
}

export interface UpdateInformationSuccess {
    type: typeof UserConstants.UPDATE_INFORMATION_SUCCESS
    payload: User
}

export const updateInformation = (data: UpdateUserInput) => {
    return {
        type: UserConstants.UPDATE_INFORMATION,
        payload: data
    }
}

export interface Logout {
    type: typeof UserConstants.LOGOUT
}

export const logout = () => {
    return {
        type: UserConstants.LOGOUT
    }
}

export type Actions =
    | LoadUser
    | LoadUserSuccess
    | LoadUserFailed
    | Login
    | LoginSuccess
    | LoginFailed
    | OAuth
    | OAuthSuccess
    | OAuthFailed
    | Register
    | RegisterSuccess
    | RegisterFailed
    | VerifyEmail
    | VerifyEmailSuccess
    | VerifyEmailFailed
    | UpdateInformation
    | UpdateInformationSuccess
    | UpdateInformationFailed
    | Logout
