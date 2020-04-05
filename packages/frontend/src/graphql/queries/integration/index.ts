import { gql } from 'apollo-boost'

export const GET_INTEGRATIONS = gql`
    query getActiveIntegrations {
        getActiveIntegrations {
            _id
            type
            active
            hasSettings
        }
    }
`

export const GET_SLACK_CHANNELS = gql`
    query getSlackChannels {
        getSlackChannels {
            id
            name
        }
    }
`

export const GET_GITHUB_REPOS = gql`
    query getGithubRepositories {
        getGithubRepositories {
            name
            owner
        }
    }
`

export * from './typedefs'
