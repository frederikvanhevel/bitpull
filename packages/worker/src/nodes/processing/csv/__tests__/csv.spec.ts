import csvFileNodeMock from '../__mocks__/csv.mock'
import csvFileNode from '../'

describe('Csv node', () => {
    test('should write a csv file', async () => {
        const expected = [
            { field: 'one' },
            { field: 'two' },
            { field: 'three' }
        ]

        const result = await csvFileNode(
            {
                node: csvFileNodeMock,
                passedData: expected
            },
            { integrations: [], settings: {} },
            // @ts-ignore
            {}
        )

        expect(result.passedData.fileName.includes('.csv')).toBeTruthy()
        expect(result.passedData.path.includes('.csv')).toBeTruthy()
    })
})
