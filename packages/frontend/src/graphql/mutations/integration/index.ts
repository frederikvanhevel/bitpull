import { gql } from 'apollo-boost'

export const AUTHORIZE_INTEGRATION = gql`
    mutation authorize($type: IntegrationType!, $data: JSONObject!) {
        authorize(type: $type, data: $data)
    }
`

export const TOGGLE_INTEGRATION = gql`
    mutation toggleIntegration($id: String!, $enabled: Boolean!) {
        toggleIntegration(id: $id, enabled: $enabled)
    }
`

export const REMOVE_INTEGRATION = gql`
    mutation removeIntegration($id: String!) {
        removeIntegration(id: $id)
    }
`
