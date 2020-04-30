import { FunctionNode } from 'nodes/export/function/typedefs'
import { NodeType, NodeInput } from '../../../typedefs/node'
import { CollectNode } from '../../../nodes/processing/collect/typedefs'
import { HtmlNode } from '../../../nodes/processing/html/typedefs'
import { TestEnvironment, hasResult } from '../../utils/environment'
import { createNode, createInput } from '../../utils/factory'

jest.setTimeout(10000)

describe('Collect node', () => {
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

    it('should throw when fields is not defined', async () => {
        const node = createNode(NodeType.COLLECT)

        const promise = environment.parseNode({ node })
        await expect(promise).rejects.toThrow()
    })

    it('should throw when first field is not defined corectly', async () => {
        const node = createNode<CollectNode>(NodeType.COLLECT, {
            fields: [
                {
                    value: ''
                }
            ]
        })

        const promise = environment.parseNode({ node })
        await expect(promise).rejects.toThrow()
    })

    it('should get fields from page', async () => {
        const callback = jest.fn()
        const root = createNode<HtmlNode>(NodeType.HTML)
        const node = createNode<CollectNode>(
            NodeType.COLLECT,
            {
                fields: [
                    {
                        label: 'url',
                        selector: {
                            value: '.link',
                            attribute: 'href'
                        }
                    }
                ]
            },
            callback
        )
        const content =
            '<a class="link" href="https://test.be">This is a link</a>'

        const input = createInput(node, undefined, root)
        input.page = await environment.initializePage(content)

        await environment.parseNode(input)

        expect(callback).toHaveBeenCalledWith(
            expect.objectContaining({
                passedData: {
                    url: 'https://test.be'
                }
            })
        )
    })

    it('should merge previous data', async () => {
        const callback = jest.fn()
        const root = createNode<HtmlNode>(NodeType.HTML)
        const node = createNode<CollectNode>(
            NodeType.COLLECT,
            {
                append: true,
                fields: [
                    {
                        label: 'url',
                        selector: {
                            value: '.link',
                            attribute: 'href'
                        }
                    }
                ]
            },
            callback
        )
        const content =
            '<a class="link" href="https://test.be">This is a link</a>'

        const input = createInput(node, { previous: 'something' }, root)
        input.page = await environment.initializePage(content)

        await environment.parseNode(input)

        expect(callback).toHaveBeenCalledWith(
            expect.objectContaining({
                passedData: {
                    previous: 'something',
                    url: 'https://test.be'
                }
            })
        )
    })

    it('should call onWatch when running watched node', async () => {
        const root = createNode<HtmlNode>(NodeType.HTML)
        const node = createNode<CollectNode>(NodeType.COLLECT, {
            id: 'watch-id',
            fields: [
                {
                    label: 'url',
                    selector: {
                        value: '.link',
                        attribute: 'href'
                    }
                }
            ]
        })
        const content =
            '<a class="link" href="https://test.be">This is a link</a>'

        const input = createInput(node, undefined, root)
        input.page = await environment.initializePage(content)

        await environment.parseNode(input)

        expect(watchFn).toHaveBeenCalledWith({
            url: 'https://test.be'
        })
    })

    it('should traverse one child html node', async () => {
        const fn = jest.fn()
        let lastInput: NodeInput<HtmlNode>
        const root = createNode<HtmlNode>(NodeType.HTML, {
            parsedLink: 'https://test.be'
        })
        const node = createNode<CollectNode>(NodeType.COLLECT, {
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
                    linkedField: 'url',
                    children: [
                        createNode<FunctionNode>(NodeType.FUNCTION, {
                            id: '1',
                            function: (input: any) => {
                                fn()
                                lastInput = input
                            }
                        })
                    ]
                })
            ]
        })
        const initialContent =
            '<a class="link" href="https://test.be/one">Link 1</a>'

        const input = createInput(node, undefined, root)
        input.rootAncestor = root
        input.page = await environment.initializePage(initialContent)

        environment.mockPages([
            {
                url: 'https://test.be/one',
                content: 'first page content'
            }
        ])

        await environment.parseNode(input)

        expect(lastInput!).toBeDefined()
        expect(await hasResult(lastInput!, 'first page content')).toBeTruthy()
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should traverse multiple child html nodes', async () => {
        const fn = jest.fn()
        let lastInput: NodeInput<HtmlNode>
        const root = createNode<HtmlNode>(NodeType.HTML, {
            parsedLink: 'https://test.be'
        })
        const node = createNode<CollectNode>(NodeType.COLLECT, {
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
                    linkedField: 'url',
                    children: [
                        createNode<FunctionNode>(NodeType.FUNCTION, {
                            id: '1',
                            function: (input: any) => {
                                fn()
                                lastInput = input
                            }
                        })
                    ]
                })
            ]
        })
        const initialContent = `
            <a class="link" href="https://test.be/two">Link 2</a>
            <a class="link" href="https://test.be/three">Link 3</a>
        `

        const input = createInput(node, undefined, root)
        input.rootAncestor = root
        input.page = await environment.initializePage(initialContent)

        environment.mockPages([
            {
                url: 'https://test.be/two',
                content: 'second page content'
            },
            {
                url: 'https://test.be/three',
                content: 'third page content'
            }
        ])

        await environment.parseNode(input)

        expect(lastInput!).toBeDefined()
        expect(await hasResult(lastInput!, 'third page content')).toBeTruthy()
        expect(fn).toHaveBeenCalledTimes(2)
    })
})
