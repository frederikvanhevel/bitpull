import { NodeType } from '../../../../typedefs/node'
import { ScreenshotNode } from '../typedefs'

export default {
    id: '0',
    type: NodeType.SCREENSHOT,
    children: [{
        id: '1',
        type: NodeType.STORAGE
    }]
} as ScreenshotNode
