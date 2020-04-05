import { Types } from 'mongoose'
import faker from 'faker'
import { InstanceFactory } from 'utils/test-utils'
import { NodeType } from '@bitpull/worker'
import { CatalogItem } from '..'

export const CatalogFactory = new InstanceFactory<CatalogItem>(
    (): CatalogItem => {
        const id = Types.ObjectId()

        return {
            id: id.toHexString(),
            _id: id,
            name: faker.random.words(),
            title: faker.random.words(),
            description: faker.random.words(),
            node: {
                id: faker.random.uuid(),
                type: NodeType.HTML
            },
            visible: true
        }
    }
)
