import { gql } from 'apollo-boost'

export const USER_FRAGMENT = gql`
    fragment UserObject on User {
        id
        email
        firstName
        lastName
        picture
        verified
        settings {
            failedJobEmail
        }
        referralId
    }
`

export const GET_USER = gql`
    query getCurrentUser {
        getCurrentUser {
            ...UserObject
        }
    }
    ${USER_FRAGMENT}
`
