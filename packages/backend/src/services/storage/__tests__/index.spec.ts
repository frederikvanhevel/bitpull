import { mocked } from 'ts-jest/utils'
import StorageModel from 'models/storage'

jest.mock('models/storage')
const mockedStorageModel = mocked(StorageModel)

describe('Storage service', () => {
    it('should get the expiry date', async () => {})

    it('should save to storage', async () => {})

    it('should get a storage entry', async () => {})

    it('should get storage entries', async () => {})

    it('should remove from aws', async () => {})

    it('should clean storage', async () => {})
})
