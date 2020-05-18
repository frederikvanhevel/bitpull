import { HtmlNode } from '../../../nodes/processing/html/typedefs'
import { NodeType, NodeInput } from '../../../typedefs/node'
import { FunctionNode } from '../../../nodes/export/function/typedefs'
import { PaginationNode } from '../../../nodes/processing/pagination/typedefs'
import { TestEnvironment, hasResult, htmlHasResult } from '../../utils/environment'
import { createNode, createInput } from '../../utils/factory'

jest.setTimeout(10000)

describe('Pagination node', () => {
    const watchFn = jest.fn()
    const environment = new TestEnvironment()

    beforeAll(async () => {
        await environment.setup({
            watchedNodeId: 'watch-id',
            onWatch: watchFn
        })
    })

    afterAll(async () => {
        await environment.cleanup()
    })

    it('should throw when next step is not defined', async () => {
        const node = createNode<PaginationNode>(NodeType.PAGINATION, {
            pagination: {
                nextLink: '123'
            }
        })

        const promise = environment.parseNode({ node })
        await expect(promise).rejects.toThrow()
    })

    it('should throw when pagination method is not defined', async () => {
        const node = createNode(NodeType.PAGINATION)

        const promise = environment.parseNode({ node })
        await expect(promise).rejects.toThrow()
    })

    it('should go to each link', async () => {
        const fn = jest.fn()
        let lastContent: string
        const root = createNode<HtmlNode>(NodeType.HTML)
        const node = createNode<PaginationNode>(NodeType.PAGINATION, {
            pagination: {
                nextLink: {
                    value: 'a.link'
                }
            },
            goToPerPage: '1',
            children: [
                createNode<FunctionNode>(NodeType.FUNCTION, {
                    id: '1',
                    function: async (input: any) => {
                        fn()
                        lastContent = await input.page.content()
                    }
                })
            ]
        })

        const content =
            '<a class="link" href="https://test.be/two">This is a link</a>'

        environment.mockPage({
            url: 'https://test.be/two',
            content: 'Hello world two'
        })

        const input = createInput(node, undefined, root)
        input.page = await environment.initializePage(content)

        await environment.parseNode(input)

        expect(htmlHasResult(lastContent!, 'Hello world two')).toBeTruthy()
        expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should call onWatch when running watched node', async () => {
        const root = createNode<HtmlNode>(NodeType.HTML)
        const node = createNode<PaginationNode>(NodeType.PAGINATION, {
            id: 'watch-id',
            pagination: {
                nextLink: '.link'
            },
            goToPerPage: '1',
            children: [
                createNode<FunctionNode>(NodeType.FUNCTION, {
                    id: '1',
                    function: jest.fn()
                })
            ]
        })

        const content =
            '<a class="link" href="https://test.be/two">This is a link</a>'

        environment.mockPages([
            {
                url: 'https://test.be/two',
                content: 'Hello world'
            }
        ])

        const input = createInput(node, undefined, root)
        input.page = await environment.initializePage(content)

        await environment.parseNode(input)

        expect(watchFn).toHaveBeenCalledWith(undefined)
    })
})
