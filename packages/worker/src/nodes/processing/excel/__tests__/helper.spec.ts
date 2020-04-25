import { transformToExcelFormat } from '../helper'

describe('Excel node helper', () => {
    it('should transform data properly', () => {
        const data = {
            one: 'prop1',
            two: ['prop2', 'prop3'],
            three: 'prop3'
        }

        const expected = {
            one: 'prop1',
            two: 'prop2, prop3',
            three: 'prop3'
        }

        const transformed = transformToExcelFormat(data)

        expect(transformed).toEqual(expected)
    })
})
