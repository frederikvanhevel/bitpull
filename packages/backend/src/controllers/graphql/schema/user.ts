import { makeExecutableSchema, IResolvers } from 'graphql-tools'
import { gql } from 'apollo-server'
import {
    getCurrentUser,
    register,
    oAuth,
    login,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
    updateInformation,
    cancelAccount,
    updateSettings
} from '../resolvers/user'
import {
    User,
    RegisterUserInput,
    LoginUserInput,
    LoginUserResponse,
    UpdateUserInput,
    OAuthInput,
    UserSettingsInput
} from '../typedefs/user'

const query = gql`
    directive @isAuthenticated on FIELD_DEFINITION

    type Query {
        getCurrentUser: User! @isAuthenticated
    }

    type Mutation {
        login(data: LoginUserInput!): LoginUserResponse!
        oAuth(data: OAuthInput!): LoginUserResponse!
        register(data: RegisterUserInput!): LoginUserResponse!
        forgotPassword(email: String!): Boolean!
        resetPassword(token: String!, password: String!): Boolean!
        sendVerificationEmail: Boolean! @isAuthenticated
        verifyEmail(token: String!): Boolean!
        updateInformation(data: UpdateUserInput!): User! @isAuthenticated
        cancelAccount: Boolean! @isAuthenticated
        updateSettings(settings: UserSettingsInput!): Boolean! @isAuthenticated
    }
`
const resolvers: IResolvers = {
    Query: {
        getCurrentUser
    },
    Mutation: {
        register,
        oAuth,
        login,
        forgotPassword,
        resetPassword,
        sendVerificationEmail,
        verifyEmail,
        updateInformation,
        cancelAccount,
        updateSettings
    }
}

export default makeExecutableSchema({
    typeDefs: [
        User,
        UserSettingsInput,
        RegisterUserInput,
        LoginUserInput,
        LoginUserResponse,
        UpdateUserInput,
        OAuthInput,
        query
    ],
    resolvers
})
