import React from 'react'
import { MenuItem, ListItemIcon } from '@material-ui/core'
import { Node } from 'typedefs/common'
import { NodeType } from '@bitpull/worker/lib/typedefs'
import { getIcon, getMenuItemsByType, NodeMenuItem } from '../../helper'
import {
    PaginationTypes,
    NextLinkPagination,
    LinkListPagination
} from '@bitpull/worker/lib/nodes/processing/pagination/typedefs'
import { NODE_PROPERTIES } from '../../helper/properties'

export enum PaginationStep {
    PER_PAGE = 'goToPerPage',
    END = 'gotoOnEnd'
}

export const ALLOWED_CHILD_NODES: Record<PaginationStep, NodeType[]> = {
    [PaginationStep.PER_PAGE]: [
        NodeType.COLLECT,
        NodeType.SCROLL,
        NodeType.SCREENSHOT,
        NodeType.PDF
    ],
    [PaginationStep.END]: [
        NodeType.WEBHOOK,
        NodeType.EXCEL,
        NodeType.CSV,
        NodeType.JSON
    ]
}

export const hasValidChildren = (node: Node, type: PaginationStep) => {
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
    type: PaginationStep,
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
    type: PaginationStep,
    onHighlightNode: (node?: Node) => void
) => {
    if (hasValidChildren(node, type)) {
        const menuItems = getMenuItemsByType(ALLOWED_CHILD_NODES[type])

        return menuItems.map((item: NodeMenuItem) => {
            const Icon = getIcon(item.type)

            return (
                <MenuItem key={item.type} value={item.type}>
                    <ListItemIcon>
                        <Icon />
                    </ListItemIcon>{' '}
                    {item.label}
                </MenuItem>
            )
        })
    }

    return getExistingNodes(node, type, onHighlightNode)
}

export const isNextLinkPagination = (
    pagination: PaginationTypes
): pagination is NextLinkPagination => {
    return (pagination as NextLinkPagination).nextLink !== undefined
}

export const isLinkListPagination = (
    pagination: PaginationTypes
): pagination is LinkListPagination => {
    return (pagination as LinkListPagination).linkList !== undefined
}
