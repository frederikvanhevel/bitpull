import { gql } from 'apollo-server'

export const Storage = gql`
    enum StorageService {
        NATIVE
        DROPBOX
        GOOGLE_DRIVE
        ONEDRIVE
        GITHUB
    }
    enum ResourceType {
        JOB
        TEST_RUN
    }
    type StorageLink {
        _id: String!
        service: StorageService!
        fileName: String!
        contentType: String!
        expiryDate: DateTime
        createdAt: DateTime!
    }
    type Storage {
        _id: String!
        links: [StorageLink!]!
        count: Int!
        resourceType: ResourceType!
        resourceId: String
        resourceName: String!
        owner: String!
        updatedAt: DateTime!
    }
`
