import { gql } from 'apollo-boost'

export const USER_FRAGMENT = gql`
    fragment UserObject on User {
        email
        firstName
        lastName
        picture
        verified
        settings {
            failedJobEmail
        }
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

export const GET_REFERRAL_LINK = gql`
    query getReferralLink {
        getReferralLink
    }
`
