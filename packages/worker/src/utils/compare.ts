import hash from 'object-hash'

export const compareArray = (oldArr: object[], newArr: object[]) => {
    const hashArrayOld = oldArr.map(item => hash(item))
    return newArr.filter(item => !hashArrayOld.includes(hash(item)))
}

export const compare = (
    oldObj: object | object[],
    newObj: object | object[]
) => {
    if (Array.isArray(oldObj) && Array.isArray(newObj)) {
        return compareArray(oldObj, newObj)
    }

    return newObj
}
