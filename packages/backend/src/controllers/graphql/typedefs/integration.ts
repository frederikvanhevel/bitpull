import { gql } from 'apollo-server'

export const IntegrationSettings = gql`
    type IntegrationSettings {
        access_token: String
    }
`

export const Integration = gql`
    scalar JSONObject

    enum IntegrationType {
        DROPBOX
        SLACK
        ONEDRIVE
        GOOGLE_DRIVE
        GITHUB
    }
    type Integration {
        _id: String!
        type: IntegrationType!
        active: Boolean!
        hasSettings: Boolean!
        owner: String
    }
`

export const IntegrationInput = gql`
    input IntegrationInput {
        active: Boolean
        settings: IntegrationSettingsInput
    }
`

export const IntegrationSettingsInput = gql`
    input IntegrationSettingsInput {
        access_token: String!
    }
`

export const SlackChannel = gql`
    type SlackChannel {
        id: String!
        name: String!
    }
`

export const GithubRepository = gql`
    type GithubRepository {
        name: String!
        owner: String!
    }
`
