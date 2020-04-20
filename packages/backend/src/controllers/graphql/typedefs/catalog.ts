import { gql } from 'apollo-server'

export const CatalogItem = gql`
    type CatalogItem {
        id: String!
        name: String!
        title: String!
        node: JSONObject!
    }
`

export const CatalogItemInput = gql`
    input CatalogItemInput {
        name: String!
        title: String!
        description: String
        node: JSONObject!
    }
`
