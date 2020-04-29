import Traverser from '../../traverse'
import { NodeType } from '../../typedefs/node'
import { CollectNode } from '../../nodes/processing/collect/typedefs'
import { HtmlNode } from '../../nodes/processing/html/typedefs'
import { setup, cleanup, initializePage } from './../test-helper'
import { createNode, createInput } from './../factory'

describe('Collect node', () => {
    let traverser: Traverser

    beforeAll(async () => {
        traverser = await setup({
            settings: {
                exitOnError: true
            }
        })
    })

    afterAll(async () => {
        await cleanup()
    })

    it('should throw when fields is not defined', async () => {
        const node = createNode(NodeType.COLLECT)

        const promise = traverser.parseNode({ node })
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

        const promise = traverser.parseNode({ node })
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
        input.page = await initializePage(content)

        await traverser.parseNode(input)

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
        input.page = await initializePage(content)

        await traverser.parseNode(input)

        expect(callback).toHaveBeenCalledWith({
            previous: 'something',
            url: 'https://test.be'
        })
    })
})
