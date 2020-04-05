import { gql } from 'apollo-boost'

export const PICK_CATALOG_ITEM = gql`
    mutation pickCatalogItem($id: String!) {
        pickCatalogItem(id: $id) {
            id
        }
    }
`
