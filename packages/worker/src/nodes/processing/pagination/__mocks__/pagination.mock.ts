import { NodeType } from '../../../../typedefs/node'
import { PaginationNode } from '../typedefs'

export default {
    id: '1',
    type: NodeType.PAGINATION,
    pagination: {
        nextLink: {
            value: 'a.next',
            attribute: 'href'
        }
    },
    goToPerPage: '2',
    gotoOnEnd: '3',
    children: [
        {
            id: '2',
            type: NodeType.COLLECT,
            // @ts-ignore
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
        }
    ]
} as PaginationNode
