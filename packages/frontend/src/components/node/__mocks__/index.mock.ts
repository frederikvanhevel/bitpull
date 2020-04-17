import { NodeType } from '@bitpull/worker/lib/typedefs'
import { uuid } from 'uuidv4'

export const getNode = (type: NodeType, extra: object = {}) => {
    return {
        id: uuid(),
        type,
        ...extra
    }
}
