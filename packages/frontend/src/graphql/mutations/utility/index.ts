import { gql } from 'apollo-boost'

export const ENCRYPT = gql`
    mutation encrypt($text: String!) {
        encrypt(text: $text)
    }
`
