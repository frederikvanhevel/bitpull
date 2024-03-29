import React from 'react'
import { getMenuItemsByType } from '../helper'
import { Node } from 'typedefs/common'
import AddStep from './AddStep'
import { NodeType, NodeMap } from '@bitpull/worker/lib/typedefs'
import { findUrlAncestor } from 'components/node'

interface Props {
    node: Node
    onAddNode: (type: NodeType) => void
}

const getItems = (node: Node) => {
    const urlAncestor = findUrlAncestor(node)
    const items = getMenuItemsByType(NodeMap[node.type].processing)

    return items.map(item => ({
        ...item,
        disabled: item.needsJavascript && !!urlAncestor
    }))
    // .filter(item => node.type !== item.type)
}

const SelectProcessor: React.FC<Props> = ({ node, onAddNode }) => {
    const nodes = getItems(node)

    return (
        <AddStep
            label="Add processing step"
            allowedChildNodes={nodes}
            onAddNode={onAddNode}
        />
    )
}

export default SelectProcessor
