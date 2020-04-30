import { NodeType } from '../../../typedefs/node'
import {
    HtmlNode,
    MultipleHtmlNode
} from '../../../nodes/processing/html/typedefs'
import { FunctionNode } from '../../../nodes/export/function/typedefs'
import {
    hasDefaultResult,
    hasResult,
    TestEnvironment
} from '../../utils/environment'
import { createNode, createInput } from '../../utils/factory'

jest.setTimeout(10000)

describe('Html node', () => {
    const environment = new TestEnvironment()

    beforeAll(async () => {
        await environment.setup()
        environment.mockDefault({
            content: 'Hello world'
        })
    })

    afterAll(async () => {
        await environment.cleanup()
    })

    describe('Single', () => {
        it('should throw when link is not defined', async () => {
            const node = createNode(NodeType.HTML)

            const promise = environment.parseNode({ node })
            await expect(promise).rejects.toThrow()
        })

        it('should get the content of a link', async () => {
            const node = createNode<HtmlNode>(NodeType.HTML, {
                link: 'https://test.be'
            })

            const result = await environment.parseNode({ node })
            expect(hasDefaultResult(result)).toBeTruthy()
        })
    })

    describe('Linked', () => {
        it('should throw when linked field content is not found', async () => {
            const root = createNode<HtmlNode>(NodeType.HTML, {
                link: 'https://test.be'
            })
            const node = createNode(NodeType.HTML_LINKED, {
                linkedField: 'url'
            })
            const passedData = {}

            const input = createInput(node, passedData, root)
            const promise = environment.parseNode(input)
            await expect(promise).rejects.toThrow()
        })

        it('should get the content of a linked field', async () => {
            const root = createNode<HtmlNode>(NodeType.HTML, {
                link: 'https://test.be',
                parsedLink: 'https://test.be'
            })
            const node = createNode<HtmlNode>(NodeType.HTML_LINKED, {
                linkedField: 'url'
            })
            const passedData = {
                url: 'https://second.be'
            }

            environment.mockPage({
                url: 'https://second.be',
                content: 'Second'
            })

            const input = createInput(node, passedData, root)
            const result = await environment.parseNode(input)
            expect(hasResult(result, 'Second')).toBeTruthy()
        })
    })

    describe('Multiple', () => {
        it('should throw when links are not defined', async () => {
            const node = createNode(NodeType.HTML_MULTIPLE)

            const promise = environment.parseNode({ node })
            await expect(promise).rejects.toThrow()
        })

        it('should go to each link', async () => {
            const fn = jest.fn()
            const node = createNode<MultipleHtmlNode>(NodeType.HTML_MULTIPLE, {
                links: ['https://test.be', 'https://test.be'],
                goToPerPage: '1',
                children: [
                    createNode<FunctionNode>(NodeType.FUNCTION, {
                        id: '1',
                        function: fn
                    })
                ]
            })

            await environment.parseNode({ node })
            expect(fn).toHaveBeenCalledTimes(2)
        })

        it('should go to a node on end of all links', async () => {
            const goToPerPageFn = jest.fn()
            const goToOnEndFn = jest.fn()
            const node = createNode<MultipleHtmlNode>(NodeType.HTML_MULTIPLE, {
                links: ['https://test.be'],
                goToPerPage: '1',
                goToOnEnd: '2',
                children: [
                    createNode<FunctionNode>(NodeType.FUNCTION, {
                        id: '1',
                        function: goToPerPageFn
                    }),
                    createNode<FunctionNode>(NodeType.FUNCTION, {
                        id: '2',
                        function: goToOnEndFn
                    })
                ]
            })

            await environment.parseNode({ node })
            expect(goToPerPageFn).toHaveBeenCalledTimes(1)
            expect(goToOnEndFn).toHaveBeenCalledTimes(1)
        })

        it('should traverse a simple node', async () => {
            const goToOnEndFn = jest.fn()
            const node = createNode<MultipleHtmlNode>(NodeType.HTML_MULTIPLE, {
                links: ['https://test.be'],
                children: [
                    createNode<FunctionNode>(NodeType.COLLECT, {
                        id: '1',
                        fields: [
                            {
                                label: 'one',
                                selector: {
                                    value: '.one'
                                }
                            }
                        ],
                        children: [
                            createNode<FunctionNode>(NodeType.FUNCTION, {
                                id: '2',
                                function: goToOnEndFn
                            })
                        ]
                    })
                ]
            })

            environment.mockPage({
                url: 'https://second.be',
                content: '<div class="one">hello</div>'
            })

            await environment.parseNode({ node })
            expect(goToOnEndFn).toHaveBeenCalledTimes(1)
        })
    })
})
