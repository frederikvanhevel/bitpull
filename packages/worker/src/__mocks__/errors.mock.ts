import { NodeType } from '../typedefs/node'

export default {
    id: '0',
    type: NodeType.HTML,
    link: 'https://brik.mykot.be/rooms',
    children: [
        {
            id: '1',
            type: NodeType.PAGINATION,
            pagination: {
                nextLink: {
                    value: 'a.next',
                    attribute: 'href'
                }
            },
            goToPerPage: '2',
            gotoOnEnd: '3'
        },
        {
            id: '2',
            type: NodeType.PAGINATION,
            pagination: {
                nextLink: {
                    value: 'a.next',
                    attribute: 'href'
                }
            },
            goToPerPage: '2',
            gotoOnEnd: '3'
        },
        {
            id: '3',
            type: NodeType.PAGINATION,
            pagination: {
                nextLink: {
                    value: 'a.next',
                    attribute: 'href'
                }
            },
            goToPerPage: '2',
            gotoOnEnd: '3'
        },
        {
            id: '4',
            type: NodeType.PAGINATION,
            pagination: {
                nextLink: {
                    value: 'a.next',
                    attribute: 'href'
                }
            },
            goToPerPage: '2',
            gotoOnEnd: '3'
        }
    ]
}
