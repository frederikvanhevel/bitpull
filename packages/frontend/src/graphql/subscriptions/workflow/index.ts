import { gql } from 'apollo-boost'

export const NODE_SUBSCRIPTION = gql`
    subscription nodeEvent {
        nodeEvent {
            event
            data
        }
    }
`
