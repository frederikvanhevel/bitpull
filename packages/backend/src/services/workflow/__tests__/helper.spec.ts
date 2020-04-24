import { NodeType, FlowNode } from '@bitpull/worker'
import { limitFollowedLinks } from '../helper'

describe('Workflow helper', () => {
    it('should add limits to a node tree', async () => {
        const input: FlowNode = {
            id: '1',
            type: NodeType.HTML,
            children: [{
                id: '2',
                type: NodeType.COLLECT,
                children: [{
                    id: '3',
                    type: NodeType.PAGINATION
                }]
            },
            {
                id: '4',
                type: NodeType.PAGINATION
            }]
        }

        const output: FlowNode = {
            id: '1',
            type: NodeType.HTML,
            children: [{
                id: '2',
                type: NodeType.COLLECT,
                limit: 1,
                children: [{
                    id: '3',
                    type: NodeType.PAGINATION,
                    // @ts-ignore
                    linkLimit: 1
                }]
            },
            {
                id: '4',
                type: NodeType.PAGINATION,
                // @ts-ignore
                linkLimit: 1
            }]
        }

        expect(limitFollowedLinks(input)).toEqual(output)
    })
})
