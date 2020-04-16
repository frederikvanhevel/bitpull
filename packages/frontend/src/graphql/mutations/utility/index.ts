import { gql } from 'apollo-boost'

export const ENCRYPT = gql`
    mutation encrypt($text: String!) {
        encrypt(text: $text)
    }
`

export const SEND_FEEDBACK = gql`
    mutation feedback($type: String!, $question: String!) {
        feedback(type: $type, question: $question)
    }
`
