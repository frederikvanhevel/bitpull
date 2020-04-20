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
            gotoOnEnd: '3',
            children: [
                {
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
                    ],
                    children: [
                        {
                            id: '4',
                            type: NodeType.HTML,
                            linkedField: 'url',
                            children: [
                                {
                                    id: '5',
                                    type: NodeType.COLLECT,
                                    append: true,
                                    fields: [
                                        {
                                            label: 'type',
                                            selector: {
                                                value: '.type'
                                            }
                                        },
                                        {
                                            label: 'surface',
                                            selector: {
                                                value: '.surface'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
