import { compareObjects, compareArrays } from '../../utils/compare'

describe('Comparison', () => {
    describe('objects', () => {
        it('should compare two objects and return new object if different', () => {
            const oldObj = {
                name: 'flex',
                value: 1231
            }

            const newObj = {
                name: 'flex',
                value: 1232
            }

            const result = compareObjects(oldObj, newObj)
            expect(result).toEqual(newObj)
        })

        it('should compare two objects and return nothing if same', () => {
            const oldObj = {
                name: 'flex',
                value: 1231
            }

            const newObj = {
                name: 'flex',
                value: 1231
            }

            const result = compareObjects(oldObj, newObj)
            expect(result).toEqual(undefined)
        })
    })

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

        const result = compareArrays(oldArr, newArr)
        expect(result).toEqual([
            {
                name: 'mork',
                value: 90
            }
        ])
    })
})
