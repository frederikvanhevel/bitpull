import { WebhookNode } from '../typedefs'
import { NodeType } from '../../../../typedefs/node'

export default {
    id: '0',
    type: NodeType.WEBHOOK,
    path: 'http://localhost:3000/api/test'
} as WebhookNode
