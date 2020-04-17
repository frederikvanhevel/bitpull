import { isNodeUnreachable, traverseAncestors } from '..'
import { NodeType } from '@bitpull/worker/lib/typedefs'
import { getNode } from '../__mocks__/index.mock'

describe('Node helper', () => {
    describe('isNodeUnreachable', () => {
        it('parent is diabled', () => {
            const node = {
                ...getNode(NodeType.COLLECT),
                parent: {
                    ...getNode(NodeType.CLICK),
                    disabled: true
                }
            }
            expect(isNodeUnreachable(node)).toBeTruthy()
        })

        it('parent is not diabled', () => {
            const node = {
                ...getNode(NodeType.COLLECT),
                parent: getNode(NodeType.CLICK)
            }
            expect(isNodeUnreachable(node)).toBeFalsy()
        })

        it('ancestor is diabled', () => {
            const node = {
                ...getNode(NodeType.COLLECT),
                parent: {
                    ...getNode(NodeType.CLICK),
                    parent: {
                        ...getNode(NodeType.CLICK),
                        disabled: true
                    }
                }
            }
            expect(isNodeUnreachable(node)).toBeTruthy()
        })

        it('pagination is not configured', () => {
            const node = {
                ...getNode(NodeType.COLLECT),
                parent: getNode(NodeType.PAGINATION)
            }
            expect(isNodeUnreachable(node)).toBeTruthy()
        })

        it('pagination pointer is configured', () => {
            const collect = getNode(NodeType.COLLECT)
            const node = {
                ...collect,
                parent: {
                    ...getNode(NodeType.PAGINATION),
                    goToPerPage: collect.id,
                    goToOnEnd: '2'
                }
            }
            expect(isNodeUnreachable(node)).toBeFalsy()
        })

        it('pagination pointer is not configured', () => {
            const node = {
                ...getNode(NodeType.COLLECT),
                parent: {
                    ...getNode(NodeType.PAGINATION),
                    goToPerPage: '1',
                    goToOnEnd: '2'
                }
            }
            expect(isNodeUnreachable(node)).toBeTruthy()
        })
    })

    describe('traverseAncestors', () => {
        it('goes up correctly', () => {
            const html = getNode(NodeType.HTML)
            const paginate = getNode(NodeType.PAGINATION)
            // @ts-ignore
            paginate.parent = html
            const collect = getNode(NodeType.COLLECT)
            // @ts-ignore
            collect.parent = paginate
            const html2 = getNode(NodeType.HTML)
            // @ts-ignore
            html2.parent = collect
            const collect2 = getNode(NodeType.COLLECT)
            // @ts-ignore
            collect2.parent = html2

            // @ts-ignore
            html.children = [paginate]
            // @ts-ignore
            paginate.children = [collect]
            // @ts-ignore
            collect.children = [html2]
            // @ts-ignore
            html2.children = [collect2]

            const expected = {
                id: expect.anything(),
                type: NodeType.HTML,
                children: [
                    {
                        id: expect.anything(),
                        type: NodeType.COLLECT,
                        limit: 1,
                        children: [
                            {
                                id: expect.anything(),
                                type: NodeType.HTML
                            }
                        ]
                    }
                ]
            }

            expect(traverseAncestors(collect2)).toEqual(expected)
        })
    })
})
