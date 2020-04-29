import Traverser from '../../traverse'
import { NodeType } from '../../typedefs/node'
import { HtmlNode } from '../../nodes/processing/html/typedefs'
import { FunctionNode } from '../../nodes/export/function/typedefs'
import {
    setup,
    cleanup,
    hasDefaultResult,
    mockPage,
    hasResult
} from './../test-helper'
import { createNode, createInput } from './../factory'

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

        it('should throw when linked field content is not found', async () => {
            const root = createNode<HtmlNode>(NodeType.HTML, {
                link: 'https://test.be'
            })
            const node = createNode(NodeType.HTML, {
                linkedField: 'url'
            })
            const passedData = {}

            const input = createInput(node, passedData, root)
            const promise = traverser.parseNode(input)
            await expect(promise).rejects.toThrow()
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

    describe('Multiple', () => {
        it('should throw when links are not defined', async () => {
            const node = createNode(NodeType.HTML_MULTIPLE)

            const promise = traverser.parseNode({ node })
            await expect(promise).rejects.toThrow()
        })

        it('should throw when next step is not defined', async () => {
            const node = createNode(NodeType.HTML_MULTIPLE, {
                links: ['https://test.be']
            })

            const promise = traverser.parseNode({ node })
            await expect(promise).rejects.toThrow()
        })

        it('should go to each link', async () => {
            const fn = jest.fn()
            const node = createNode<HtmlNode>(NodeType.HTML_MULTIPLE, {
                links: ['https://test.be'],
                goToPerPage: '1',
                children: [
                    createNode<FunctionNode>(NodeType.FUNCTION, {
                        id: '1',
                        function: fn
                    })
                ]
            })

            await traverser.parseNode({ node })
            expect(fn).toHaveBeenCalled()
        })

        it('should go to a node on end of all links', async () => {
            const fn = jest.fn()
            const node = createNode<HtmlNode>(NodeType.HTML_MULTIPLE, {
                links: ['https://test.be'],
                goToPerPage: '1',
                gotToOnEnd: '2',
                children: [
                    createNode<FunctionNode>(NodeType.FUNCTION, {
                        id: '1',
                        function: jest.fn()
                    }),
                    createNode<FunctionNode>(NodeType.FUNCTION, {
                        id: '2',
                        function: fn
                    })
                ]
            })

            await traverser.parseNode({ node })
            expect(fn).toHaveBeenCalled()
        })
    })
})
