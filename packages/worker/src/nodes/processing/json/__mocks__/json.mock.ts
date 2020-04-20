import { NodeType } from '../../../../typedefs/node'
import { JsonNode } from '../typedefs'

export default {
    id: '0',
    type: NodeType.JSON,
    children: [
        {
            id: '1',
            type: NodeType.STORAGE
        }
    ]
} as JsonNode
