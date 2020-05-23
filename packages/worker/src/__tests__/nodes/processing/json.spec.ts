import { mocked } from 'ts-jest/utils'
import { TestEnvironment } from '../../utils/environment'
import { createNode, createInput } from '../../utils/factory'
import { JsonNode } from '../../../nodes/processing/json/typedefs'
import { NodeType } from '../../../typedefs/node'
import { readFile, FileEncoding } from '../../../utils/file'
import Storage from '../../../nodes/common/storage'

jest.setTimeout(10000)
jest.mock('../../../nodes/common/storage')

const mockedStorage = mocked(Storage)

describe('Json node', () => {
    const environment = new TestEnvironment()

    beforeAll(async () => {
        await environment.setup()
    })

    afterAll(async () => {
        await environment.cleanup()
    })

    it('should write to a file and pass the path on', async () => {
        let passedData: any

        const callback = jest.fn()
        const data = [{ one: 1, two: 2, three: 3 }]
        const node = createNode<JsonNode>(NodeType.JSON, {}, (data: any) => {
            passedData = data.passedData
            callback()
        })
        const input = createInput(node, data)

        mockedStorage.getChangedData.mockResolvedValueOnce(data)

        await environment.parseNode(input)

        expect(callback).toHaveBeenCalled()
        expect(passedData).toEqual({
            path: expect.stringContaining('.json'),
            fileName: expect.stringContaining('.json'),
            contentType: 'application/json'
        })

        const content = await readFile(passedData.path, FileEncoding.UTF8)

        expect(JSON.parse(content)).toEqual(data)
    })

    it('should not run next step when there are no results', async () => {
        const callback = jest.fn()
        const data: object[] = []
        const node = createNode<JsonNode>(NodeType.JSON, {}, callback)
        const input = createInput(node, data)

        mockedStorage.getChangedData.mockResolvedValueOnce([])

        await environment.parseNode(input)

        expect(callback).not.toHaveBeenCalled()
    })
})
