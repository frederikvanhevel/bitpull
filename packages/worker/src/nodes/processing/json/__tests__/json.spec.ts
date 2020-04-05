import fs from 'fs'

import jsonFileNodeMock from '../__mocks__/json.mock'
import jsonFileNode from '../'

describe('Excel node', () => {
    test('should write a json file', async () => {
        const expected = { field: 'one' }

        const result = await jsonFileNode(
            {
                node: jsonFileNodeMock,
                passedData: expected
            },
            { integrations: [], settings: {} },
            // @ts-ignore
            {}
        )

        // eslint-disable-next-line
        const fileContent = fs.readFileSync(result.passedData!.path, 'utf8')

        expect(JSON.parse(fileContent)).toEqual(expected)
    })
})
