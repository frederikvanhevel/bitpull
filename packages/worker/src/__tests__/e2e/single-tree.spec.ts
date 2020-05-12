import { TestEnvironment, hasResult } from '../utils/environment'
import { createNode } from '../utils/factory'
import { NodeType } from '../../typedefs/node'

jest.setTimeout(10000)

const node = createNode(NodeType.HTML, {
    link: 'https://test.be',
    children: [
        createNode(NodeType.PAGINATION, {
            pagination: {
                nextLink: '.none'
            },
            goToPerPage: '1',
            children: [
                createNode(NodeType.COLLECT, {
                    id: '1',
                    fields: [
                        {
                            label: 'url',
                            selector: {
                                value: '.link',
                                attribute: 'href'
                            }
                        }
                    ],
                    children: [
                        createNode(NodeType.HTML_LINKED, {
                            linkedField: 'url'
                        })
                    ]
                })
            ]
        })
    ]
})

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
                url: 'https://test.be',
                content: '<a class="link" href="/two">link</a>'
            },
            {
                url: 'https://test.be/two',
                content: '<a class="link" href="/three">link</a>'
            },
            {
                url: 'https://test.be/three',
                content: 'Hello world'
            }
        ])

        const result = await environment.parseNode({ node })
        const stats = environment.getBrowserStats()
        expect(
            hasResult({ page: result.page } as any, 'Hello world')
        ).toBeTruthy()
        expect(stats.pageCount).toEqual(1)
    })
})
