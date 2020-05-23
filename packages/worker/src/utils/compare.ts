import hash from 'object-hash'

export const compareObjects = (hashedObject: string, newObj: object) => {
    const isDifferent = hashedObject !== hash(newObj)
    return isDifferent ? newObj : undefined
}

export const compareArrays = (hashArr: string[] = [], newArr: object[]) => {
    return newArr.filter(item => !hashArr.includes(hash(item)))
}

export const compare = (hash: string | string[], newObj: object | object[]) => {
    if (Array.isArray(hash) && Array.isArray(newObj)) {
        return compareArrays(hash, newObj)
    } else if (!Array.isArray(hash) && !Array.isArray(newObj)) {
        return compareObjects(hash, newObj)
    }

    return newObj
}
