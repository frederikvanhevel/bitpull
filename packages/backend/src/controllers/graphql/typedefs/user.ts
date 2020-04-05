import { gql } from 'apollo-server'

export const User = gql`
    type UserSettings {
        failedJobEmail: Boolean!
    }
    type User {
        id: String!
        email: String!
        firstName: String!
        lastName: String!
        picture: String
        verified: Boolean!
        settings: UserSettings!
    }
`

export const UserSettingsInput = gql`
    input UserSettingsInput {
        failedJobEmail: Boolean!
    }
`

export const RegisterUserInput = gql`
    input RegisterUserInput {
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        referralId: String
    }
`

export const LoginUserInput = gql`
    input LoginUserInput {
        email: String!
        password: String!
    }
`

export const LoginUserResponse = gql`
    type LoginUserResponse {
        user: User!
        token: String!
    }
`

export const UpdateUserInput = gql`
    input UpdateUserInput {
        email: String
        firstName: String
        lastName: String
    }
`

export const OAuthInput = gql`
    enum OAuthProvider {
        GOOGLE
    }
    input OAuthInput {
        provider: OAuthProvider!
        code: String!
        referralId: String
    }
`
