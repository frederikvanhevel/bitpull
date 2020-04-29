import { HtmlNode } from '../../nodes/processing/html/typedefs'
import Traverser from '../../traverse'
import { NodeType } from '../../typedefs/node'
import { FunctionNode } from '../../nodes/export/function/typedefs'
import { PaginationNode } from '../../nodes/processing/pagination/typedefs'
import { setup, cleanup, initializePage } from './../test-helper'
import { createNode, createInput } from './../factory'

describe('Pagination node', () => {
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

    it('should throw when next step is not defined', async () => {
        const node = createNode<PaginationNode>(NodeType.PAGINATION, {
            pagination: {
                nextLink: '123'
            }
        })

        const promise = traverser.parseNode({ node })
        await expect(promise).rejects.toThrow()
    })

    it('should throw when pagination method is not defined', async () => {
        const node = createNode(NodeType.PAGINATION)

        const promise = traverser.parseNode({ node })
        await expect(promise).rejects.toThrow()
    })

    it('should go to each link', async () => {
        const fn = jest.fn()
        const root = createNode<HtmlNode>(NodeType.HTML)
        const node = createNode<PaginationNode>(NodeType.PAGINATION, {
            pagination: {
                nextLink: '.link'
            },
            goToPerPage: '1',
            children: [
                createNode<FunctionNode>(NodeType.FUNCTION, {
                    id: '1',
                    function: fn
                })
            ]
        })

        const content =
            '<a class="link" href="https://test.be/two">This is a link</a>'

        const input = createInput(node, undefined, root)
        input.page = await initializePage(content)

        await traverser.parseNode(input)
        expect(fn).toHaveBeenCalled()
    })
})
