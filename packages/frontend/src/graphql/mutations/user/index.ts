import { gql } from 'apollo-boost'
import { USER_FRAGMENT } from 'queries/user'

export const REGISTER = gql`
    mutation register($data: RegisterUserInput!) {
        register(data: $data) {
            token
            user {
                ...UserObject
            }
        }
    }
    ${USER_FRAGMENT}
`

export const REGISTER_WITH_OAUTH = gql`
    mutation oAuth($data: OAuthInput!) {
        oAuth(data: $data) {
            token
            user {
                ...UserObject
            }
        }
    }
    ${USER_FRAGMENT}
`

export const LOGIN = gql`
    mutation login($data: LoginUserInput!) {
        login(data: $data) {
            token
            user {
                ...UserObject
            }
        }
    }
    ${USER_FRAGMENT}
`

export const FORGOT_PASSWORD = gql`
    mutation forgotPassword($email: String!) {
        forgotPassword(email: $email)
    }
`

export const RESET_PASSWORD = gql`
    mutation resetPassword($token: String!, $password: String!) {
        resetPassword(token: $token, password: $password)
    }
`

export const SEND_VERIFICATION_EMAIL = gql`
    mutation sendVerificationEmail {
        sendVerificationEmail
    }
`

export const VERIFY_EMAIL = gql`
    mutation verifyEmail($token: String!) {
        verifyEmail(token: $token)
    }
`

export const UPDATE_INFORMATION = gql`
    mutation updateInformation($data: UpdateUserInput!) {
        updateInformation(data: $data) {
            ...UserObject
        }
    }
    ${USER_FRAGMENT}
`

export const CANCEL_ACCOUNT = gql`
    mutation cancelAccount {
        cancelAccount
    }
`

export const UPDATE_SETTINGS = gql`
    mutation updateSettings($settings: UserSettingsInput!) {
        updateSettings(settings: $settings)
    }
`
