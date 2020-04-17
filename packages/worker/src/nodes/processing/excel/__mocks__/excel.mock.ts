import { NodeType } from '../../../../typedefs/node'
import { ExcelNode } from '../typedefs'

export default {
    id: '0',
    type: NodeType.EXCEL,
    children: [{
        id: '1',
        type: NodeType.STORAGE
    }]
} as ExcelNode
