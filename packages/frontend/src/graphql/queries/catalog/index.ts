import { gql } from 'apollo-boost'

export const GET_CATALOG = gql`
    query getCatalogItems {
        getCatalogItems {
            id
            name
            title
            description
            node
        }
    }
`
