import { mergeData } from '../helper'

describe('Collect node helper', () => {
    it('should merge objects properly', () => {
        const oldData = {
            one: 'prop1',
            two: 'prop2',
            three: 'prop3'
        }

        const newData = {
            four: 'prop4'
        }

        const merged = mergeData(oldData, newData)

        expect(merged).toEqual({
            ...oldData,
            ...newData
        })
    })

    it('should merge an object and array properly', () => {
        const oldData = {
            one: 'prop1',
            two: 'prop2',
            three: 'prop3'
        }

        const newData = [
            {
                four: 'prop4'
            }
        ]

        const merged = mergeData(oldData, newData)

        expect(merged).toEqual({
            ...oldData,
            four: ['prop4']
        })
    })

    it('should merge two arrays properly', () => {
        const oldData = [
            {
                one: 'prop1'
            }
        ]

        const newData = [
            {
                two: 'prop2'
            }
        ]

        const merged = mergeData(oldData, newData)

        expect(merged).toEqual([{ two: 'prop2' }, { one: 'prop1' }])
    })

    it('should merge an array and an object properly', () => {
        const oldData = [
            {
                one: 'prop1'
            }
        ]
        const newData = {
            two: 'prop2'
        }

        const merged = mergeData(oldData, newData)

        expect(merged).toEqual({ two: 'prop2', one: ['prop1'] })
    })

    it('should merge an empty array and an object properly', () => {
        const oldData = {
            two: 'prop2'
        }
        const newData: any = []

        const merged = mergeData(oldData, newData)

        expect(merged).toEqual([{ two: 'prop2' }])
    })

    it('should merge an empty array and an object properly other way around', () => {
        const oldData: any = []
        const newData = {
            two: 'prop2'
        }

        const merged = mergeData(newData, oldData)

        expect(merged).toEqual([{ two: 'prop2' }])
    })
})
