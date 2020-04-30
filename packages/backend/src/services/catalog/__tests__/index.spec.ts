import { mocked } from 'ts-jest/utils'
import CatalogModel, { CatalogDocument } from 'models/catalog'
import { CatalogFactory } from 'models/catalog/__mocks__/catalog.mock'
import WorkflowService from 'services/workflow'
import { UserFactory } from 'models/user/__mocks__/user.mock'
import CatalogService from '../index'

jest.mock('models/catalog')
const mockedCatalogModel = mocked(CatalogModel)

jest.mock('services/workflow')
const mockedWorkflowService = mocked(WorkflowService)

describe('Catalog service', () => {
    it('should get catalog items', async () => {
        mockedCatalogModel.find.mockReturnValueOnce({
            // @ts-ignore
            sort: () => jest.fn()
        })

        await CatalogService.getItems()
        expect(mockedCatalogModel.find).toHaveBeenCalledWith({
            visible: true
        })
    })

    it('should add a catalog item', async () => {
        const item = CatalogFactory.getSingleRecord()
        await CatalogService.addItem(item)

        expect(mockedCatalogModel).toHaveBeenCalledWith(item)
        // @ts-ignore
        expect(mockedCatalogModel.prototype.save).toHaveBeenCalled()
    })

    it('should pick a catalog item', async () => {
        const user = UserFactory.getSingleRecord()
        const item = CatalogFactory.getSingleRecord()

        mockedCatalogModel.findById.mockResolvedValueOnce(
            item as CatalogDocument
        )

        await CatalogService.pickItem(user, item.id)

        expect(mockedWorkflowService.createWorkflow).toHaveBeenCalledWith(
            user,
            {
                name: item.title,
                node: item.node
            }
        )
    })
})
