import { gql } from 'apollo-boost'

export const CREATE_JOB = gql`
    mutation createJob($input: JobInput!) {
        createJob(input: $input) {
            id
        }
    }
`

export const RESUME_JOB = gql`
    mutation resumeJob($id: String!) {
        resumeJob(id: $id)
    }
`

export const PAUSE_JOB = gql`
    mutation pauseJob($id: String!) {
        pauseJob(id: $id)
    }
`

export const REMOVE_JOB = gql`
    mutation removeJob($id: String!) {
        removeJob(id: $id)
    }
`
