import { NodeType } from '../../../../typedefs/node'
import { PdfNode } from '../typedefs'

export default {
    id: '0',
    type: NodeType.PDF,
    children: [
        {
            id: '1',
            type: NodeType.STORAGE
        }
    ]
} as PdfNode
