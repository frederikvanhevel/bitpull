import { compareArray } from '../../utils/compare'

describe('Comparison', () => {
    it('should compare two arrays and get only new items', () => {
        const oldArr = [
            {
                name: 'flex',
                value: 1231
            },
            {
                name: 'flo',
                value: 422
            }
        ]

        const newArr = [
            {
                name: 'mork',
                value: 90
            },
            {
                name: 'flo',
                value: 422
            }
        ]

        const result = compareArray(oldArr, newArr)
        expect(result).toEqual([
            {
                name: 'mork',
                value: 90
            }
        ])
    })
})
