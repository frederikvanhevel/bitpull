import React from 'react'
import { Node } from 'typedefs/common'
import { NodeType, NodeMap } from '@bitpull/worker/lib/typedefs'
import { getMenuItemsByType } from '../helper'
import AddStep from './AddStep'

interface Props {
    node: Node
    onAddNode: (type: NodeType) => void
}

const alreadyHasChildOfType = (node: Node, type: NodeType) => {
    if (!node.children || !node.children.length) {
        return false
    }

    return node.children.some(childNode => childNode.type === type)
}

const SelectExport: React.FC<Props> = ({ node, onAddNode }) => {
    const nodes = getMenuItemsByType(NodeMap[node.type].export)
    const mappedNodes = nodes.map(item => ({
        ...item,
        disabled: alreadyHasChildOfType(node, item.type)
    }))

    return (
        <AddStep
            label="Select export method"
            allowedChildNodes={mappedNodes}
            onAddNode={onAddNode}
        />
    )
}

export default SelectExport
