import cloneDeep from 'clone-deep'

const isArray = (data: any): data is object[] => {
    return Array.isArray(data)
}

const mergeObjectAndArray = (arr: object[], obj: object) => {
    let merged = cloneDeep(obj)

    if (arr.length) {
        const keys = Object.keys(arr[0])

        keys.forEach(key => {
            // @ts-ignore
            merged[key] = arr.map((item: any) => item[key])
        })
    } else {
        merged = obj
    }

    return merged
}

export const mergeData = (
    oldData: object | object[],
    newData: object | object[]
) => {
    let mergedData: any

    if (isArray(newData) && !isArray(oldData)) {
        mergedData = mergeObjectAndArray(newData, oldData)
    } else if (!isArray(newData) && isArray(oldData)) {
        mergedData = mergeObjectAndArray(oldData, newData)
    } else if (isArray(newData) && isArray(oldData)) {
        mergedData = [...newData, ...oldData]
    } else {
        mergedData = { ...newData, ...oldData }
    }

    return mergedData
}
