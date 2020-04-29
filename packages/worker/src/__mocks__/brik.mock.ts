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
                    value: '.pager__item--next a',
                    attribute: 'href'
                }
            },
            goToPerPage: '2',
            goToOnEnd: '3',
            children: [
                {
                    id: '2',
                    type: NodeType.COLLECT,
                    fields: [
                        {
                            label: 'url',
                            selector: {
                                value: '.field-name-field-photo a',
                                attribute: 'href'
                            }
                        },
                        {
                            label: 'price',
                            selector: {
                                value: '.field__price'
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
                                                value:
                                                    '.container .field--name-field-room-type .field__item'
                                            }
                                        },
                                        {
                                            label: 'surface',
                                            selector: {
                                                value:
                                                    '.container .field--name-field-surface-area'
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
