import { NodeType } from '../../../../typedefs/node'
import { CollectNode } from '../typedefs'

export default {
    id: '2',
    type: NodeType.COLLECT,
    fields: [
        {
            label: 'url',
            selector: {
                value: '.fieldOne',
                attribute: 'href'
            }
        },
        {
            label: 'price',
            selector: {
                value: '.fieldTwo'
            }
        }
    ]
} as CollectNode
