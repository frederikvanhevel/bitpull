import { gql } from 'apollo-boost'

export const GET_STORAGE_ENTRY = gql`
    query getStorageEntry($id: String!, $offset: Int, $limit: Int) {
        getStorageEntry(id: $id, offset: $offset, limit: $limit) {
            _id
            service
            fileName
            contentType
            expiryDate
            createdAt
        }
    }
`

export const GET_STORAGE_ENTRIES = gql`
    query getStorageEntries($resourceType: ResourceType!) {
        getStorageEntries(resourceType: $resourceType) {
            _id
            resourceId
            resourceName
            resourceType
            count
        }
    }
`
