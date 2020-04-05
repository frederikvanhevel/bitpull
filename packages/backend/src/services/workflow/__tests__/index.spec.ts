import { mocked } from 'ts-jest/utils'
import WorkflowModel from 'models/workflow'

jest.mock('models/workflow')
const mockedWorkflowModel = mocked(WorkflowModel)

describe('Workflow service', () => {
    it('should get a workflow', async () => {})

    it('should get workflows', async () => {})

    it('should create a workflow', async () => {})

    it('should update a workflow', async () => {})

    it('should remove a workflow', async () => {})

    it('should check integrations', async () => {})

    it('should run a workflow', async () => {})
})
