import CatalogModel, { CatalogItem } from 'models/catalog'
import { NotFoundError } from 'utils/errors'
import { User } from 'models/user'
import WorkflowService from '../workflow'

const getItems = async () => {
    return await CatalogModel.find({
        visible: true
    })
}

const addItem = async (item: CatalogItem) => {
    const newItem = new CatalogModel(item)
    return await newItem.save()
}

const pickItem = async (user: User, id: string) => {
    const item = await CatalogModel.findById(id)

    if (!item) {
        throw new NotFoundError()
    }

    return await WorkflowService.createWorkflow(user, {
        name: item.title,
        node: item.node
    })
}

const CatalogService = {
    getItems,
    addItem,
    pickItem
}

export default CatalogService
