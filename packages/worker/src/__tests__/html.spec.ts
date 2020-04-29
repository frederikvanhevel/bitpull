import Traverser from '../traverse'
import { NodeType } from '../typedefs/node'
import { HtmlNode } from '../nodes/processing/html/typedefs'
import {
    setup,
    cleanup,
    hasDefaultResult,
    createInput,
    mockPage,
    hasResult
} from './test-helper'
import { createNode } from './factory'

describe('Html node', () => {
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

    describe('Single', () => {
        it('should throw when link is not defined', async () => {
            const node = createNode(NodeType.HTML)

            const promise = traverser.parseNode({ node })
            await expect(promise).rejects.toThrow()
        })

        it('should get the content of a link', async () => {
            const node = createNode<HtmlNode>(NodeType.HTML, {
                link: 'https://test.be'
            })

            const result = await traverser.parseNode({ node })
            expect(hasDefaultResult(result)).toBeTruthy()
        })

        it('should not hrow when linked field content is not found', async () => {
            const root = createNode<HtmlNode>(NodeType.HTML, {
                link: 'https://test.be'
            })
            const node = createNode(NodeType.HTML, {
                linkedField: 'url'
            })
            const passedData = {}

            const input = createInput(node, passedData, root)
            const promise = traverser.parseNode(input)
            await expect(promise).resolves.not.toThrow()
        })

        it('should get the content of a linked field', async () => {
            const root = createNode<HtmlNode>(NodeType.HTML, {
                link: 'https://test.be'
            })
            const node = createNode<HtmlNode>(NodeType.HTML, {
                linkedField: 'url'
            })
            const passedData = {
                url: 'https://second.be'
            }

            mockPage({
                url: 'https://second.be',
                content: 'Second'
            })

            const input = createInput(node, passedData, root)
            const result = await traverser.parseNode(input)
            expect(hasResult(result, 'Second')).toBeTruthy()
        })
    })
})
