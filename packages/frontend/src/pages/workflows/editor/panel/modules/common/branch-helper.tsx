import React from 'react'
import { MenuItem, ListItemIcon } from '@material-ui/core'
import { Node } from 'typedefs/common'
import { NodeType } from '@bitpull/worker/lib/typedefs'
import { getIcon, getMenuItemsByType, NodeMenuItem } from '../../helper'
import { NODE_PROPERTIES } from '../../helper/properties'

export enum BranchStep {
    PER_PAGE = 'goToPerPage',
    END = 'goToOnEnd'
}

export const ALLOWED_CHILD_NODES: Record<BranchStep, NodeType[]> = {
    [BranchStep.PER_PAGE]: [
        NodeType.COLLECT,
        NodeType.SCROLL,
        NodeType.SCREENSHOT,
        NodeType.PDF
    ],
    [BranchStep.END]: [
        NodeType.WEBHOOK,
        NodeType.EXCEL,
        NodeType.CSV,
        NodeType.JSON
    ]
}

export const hasValidChildren = (node: Node, type: BranchStep) => {
    return (
        !node.children ||
        !node.children.length ||
        !node.children.filter(childNode =>
            ALLOWED_CHILD_NODES[type].includes(childNode.type)
        ).length
    )
}

export const getExistingNodes = (
    node: Node,
    type: BranchStep,
    onHighlightNode: (node?: Node) => void
) => {
    return (
        node.children &&
        node.children
            .filter(childNode =>
                ALLOWED_CHILD_NODES[type].includes(childNode.type)
            )
            .map(childNode => {
                const Icon = getIcon(childNode.type)
                return (
                    <MenuItem
                        key={childNode.id}
                        value={childNode.id}
                        onMouseOver={() => onHighlightNode(childNode)}
                        onMouseOut={() => onHighlightNode(undefined)}
                    >
                        <ListItemIcon>
                            <Icon />
                        </ListItemIcon>{' '}
                        {NODE_PROPERTIES[childNode.type].label}
                    </MenuItem>
                )
            })
    )
}

export const getMenuItems = (
    node: Node,
    type: BranchStep,
    onHighlightNode: (node?: Node) => void
) => {
    let menuItems: JSX.Element[] = []
    const existingNodes =
        node.children?.filter(childNode =>
            ALLOWED_CHILD_NODES[type].includes(childNode.type)
        ) || []
    const existingNodesTypes = existingNodes.map(item => item.type)
    const newNodes = getMenuItemsByType(ALLOWED_CHILD_NODES[type]).filter(
        item => !existingNodesTypes.includes(item.type)
    )

    existingNodes.forEach(childNode => {
        const Icon = getIcon(childNode.type)
        menuItems.push(
            <MenuItem
                key={childNode.id}
                value={childNode.id}
                onMouseOver={() => onHighlightNode(childNode)}
                onMouseOut={() => onHighlightNode(undefined)}
            >
                <ListItemIcon>
                    <Icon />
                </ListItemIcon>{' '}
                {NODE_PROPERTIES[childNode.type].label}
            </MenuItem>
        )
    })

    newNodes.forEach((item: NodeMenuItem) => {
        const Icon = getIcon(item.type)

        menuItems.push(
            <MenuItem key={item.type} value={item.type}>
                <ListItemIcon>
                    <Icon />
                </ListItemIcon>{' '}
                {item.label}
            </MenuItem>
        )
    })

    return menuItems
}
