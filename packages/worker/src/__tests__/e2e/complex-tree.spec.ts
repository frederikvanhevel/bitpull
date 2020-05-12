import { TestEnvironment } from '../utils/environment'
import { createNode } from '../utils/factory'
import { NodeType } from '../../typedefs/node'

jest.setTimeout(30000)

const createTest = () => {
    const fn = jest.fn()
    const node = createNode(NodeType.HTML, {
        link: 'https://test.be/one',
        children: [
            createNode(NodeType.PAGINATION, {
                pagination: {
                    nextLink: {
                        value: '.next'
                    }
                },
                goToPerPage: '1',
                goToOnEnd: '2',
                children: [
                    createNode(NodeType.COLLECT, {
                        id: '1',
                        fields: [
                            {
                                label: 'title',
                                selector: {
                                    value: '.title'
                                }
                            },
                            {
                                label: 'link',
                                selector: {
                                    value: '.title a',
                                    attribute: 'href'
                                }
                            },
                            {
                                label: 'price',
                                selector: {
                                    value: '.price'
                                }
                            }
                        ],
                        children: [
                            createNode(NodeType.HTML_LINKED, {
                                linkedField: 'link',
                                children: [
                                    createNode(NodeType.COLLECT, {
                                        append: true,
                                        fields: [
                                            {
                                                label: 'location',
                                                selector: {
                                                    value: '.location'
                                                }
                                            }
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    createNode(NodeType.FUNCTION, {
                        id: '2',
                        function: fn
                    })
                ]
            })
        ]
    })

    return {
        node,
        fn
    }
}

describe('E2E single tree', () => {
    const environment = new TestEnvironment()

    beforeAll(async () => {
        await environment.setup()
    })

    afterAll(async () => {
        await environment.cleanup()
    })

    it('should parse the full tree and get the result of the last page', async () => {
        environment.mockPages([
            {
                url: 'https://test.be/one',
                content: `
                    <div class="list">
                        <div>
                            <div class="title">
                                <a href="/item1">Sony XPR</a>
                            </div>
                            <div class="price">$800</div>
                        </div>
                        <div>
                            <div class="title">
                                <a href="/item2">Iphone 8</a>
                            </div>
                            <div class="price">$3200</div>
                        </div>
                        <div>
                            <div class="title">
                                <a href="/item3">Android 10</a>
                            </div>
                            <div class="price">$128</div>
                        </div>
                    </div>
                    <a class="next" href="/two">link</a>
                `
            },
            {
                url: 'https://test.be/two',
                content: `
                    <div class="list">
                        <div>
                            <div class="title">
                                <a href="/item4">Xperia 3</a>
                            </div>
                            <div class="price">$111</div>
                        </div>
                        <div>
                            <div class="title">
                                <a href="/item5">Iphone SE</a>
                            </div>
                            <div class="price">$799</div>
                        </div>
                        <div>
                            <div class="title">
                                <a href="/item6">Android PI</a>
                            </div>
                            <div class="price">$330</div>
                        </div>
                    </div>
                `
            },
            {
                url: 'https://test.be/item1',
                content: '<div class="location">Berlin</div>'
            },
            {
                url: 'https://test.be/item2',
                content: '<div class="location">London</div>'
            },
            {
                url: 'https://test.be/item3',
                content: '<div class="location">New York</div>'
            },
            {
                url: 'https://test.be/item4',
                content: '<div class="location">Chicago</div>'
            },
            {
                url: 'https://test.be/item5',
                content: '<div class="location">Tokyo</div>'
            },
            {
                url: 'https://test.be/item6',
                content: '<div class="location">Oslo</div>'
            }
        ])

        const { node, fn } = createTest()

        await environment.parseNode({ node })
        const stats = environment.getBrowserStats()

        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith(
            expect.objectContaining({
                passedData: [
                    {
                        location: 'Berlin',
                        title: 'Sony XPR',
                        link: 'https://test.be/item1',
                        price: '$800'
                    },
                    {
                        location: 'London',
                        title: 'Iphone 8',
                        link: 'https://test.be/item2',
                        price: '$3200'
                    },
                    {
                        location: 'New York',
                        title: 'Android 10',
                        link: 'https://test.be/item3',
                        price: '$128'
                    },
                    {
                        location: 'Chicago',
                        title: 'Xperia 3',
                        link: 'https://test.be/item4',
                        price: '$111'
                    },
                    {
                        location: 'Tokyo',
                        title: 'Iphone SE',
                        link: 'https://test.be/item5',
                        price: '$799'
                    },
                    {
                        location: 'Oslo',
                        title: 'Android PI',
                        link: 'https://test.be/item6',
                        price: '$330'
                    }
                ]
            })
        )
        expect(stats.pageCount).toEqual(8)
    })
})
