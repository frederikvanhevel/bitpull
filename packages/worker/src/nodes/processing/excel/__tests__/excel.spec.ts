import excelFileNodeMock from '../__mocks__/excel.mock'
import excelFileNode from '../'

describe('Excel node', () => {
    test('should write an excel file', async () => {
        const expected = [
            { field: 'one' },
            { field: 'two' },
            { field: 'three' }
        ]

        const result = await excelFileNode(
            {
                node: excelFileNodeMock,
                passedData: expected
            },
            { integrations: [], settings: {} },
            // @ts-ignore
            {}
        )

        expect(result.passedData.fileName.includes('.xls')).toBeTruthy()
        expect(result.passedData.path.includes('.xls')).toBeTruthy()
    })
})
