const isArray = (data: any): data is object[] => {
    return Array.isArray(data)
}

const objectMap = (object: object, mapFn: Function) => {
    return Object.keys(object).reduce(function (result, key) {
        // @ts-ignore
        result[key] = mapFn(object[key])
        return result
    }, {})
}

export const transformToExcelFormat = (data: object | object[]) => {
    const transform = (item: any) => {
        return isArray(item) ? item.join(', ') : item
    }

    if (isArray(data)) {
        return data.map(i => objectMap(i, transform))
    }

    return objectMap(data, transform)
}
