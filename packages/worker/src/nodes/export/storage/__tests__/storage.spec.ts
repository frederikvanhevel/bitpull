import storageNodeMock from '../__mocks__/storage.mock'
import parseStorageNode from '../'
import { writeFile, FileType } from '../../../../utils/file'
import { NodeType } from '../../../../typedefs/node'

describe('Storage node', () => {
    test('should parse a storage node', async () => {
        const expected = { data: 'test' }
        const filePath = await writeFile(
            JSON.stringify(expected),
            FileType.JSON
        )

        const result = await parseStorageNode(
            {
                node: storageNodeMock,
                parent: {
                    id: '00',
                    type: NodeType.JSON
                },
                passedData: {
                    path: filePath,
                    fileName: '__test__/test.json'
                }
            },
            {
                settings: {}
            },
            // @ts-ignore
            {}
        )

        expect(result.passedData.name).toEqual('<<Storage not available>>')
    })
})
