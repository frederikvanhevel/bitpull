import { NodeType } from '../../typedefs/node'
import { CollectNode } from '../../nodes/processing/collect/typedefs'
import { HtmlNode } from '../../nodes/processing/html/typedefs'
import { TestEnvironment } from '../utils/environment'
import { createNode, createInput } from '../utils/factory'
import { FunctionNode } from 'nodes/export/function/typedefs'

jest.setTimeout(10000)

describe('Collect node', () => {
    const watchFn = jest.fn()
    const environment = new TestEnvironment()

    beforeAll(async () => {
        await environment.setup({
            settings: {
                exitOnError: true
            },
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

        expect(callback).toHaveBeenCalledWith({
            url: 'https://test.be'
        })
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

        expect(callback).toHaveBeenCalledWith({
            previous: 'something',
            url: 'https://test.be'
        })
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

    it.only('should traverse child html nodes', async () => {
        const fn = jest.fn()
        const root = createNode<HtmlNode>(NodeType.HTML)
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
            children: [createNode(NodeType.HTML, {
                link: 'https://test.be',
                children: [createNode<FunctionNode>(NodeType.FUNCTION, {
                    id: '1',
                    function: fn
                })]
            })]
        })
        const content =
            '<a class="link" href="https://test.be">This is a link</a>'

        const input = createInput(node, undefined, root)
        input.page = await environment.initializePage(content)

        await environment.parseNode(input)

        expect(fn).toHaveBeenCalledWith({
            url: 'https://test.be'
        })
    })
})
