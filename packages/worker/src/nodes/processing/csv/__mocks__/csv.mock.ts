import { NodeType } from '../../../../typedefs/node'
import { CsvNode } from '../typedefs'

export default {
    id: '0',
    type: NodeType.CSV,
    children: [{
        id: '1',
        type: NodeType.STORAGE
    }]
} as CsvNode
