import React from 'react'
import { Node } from 'typedefs/common'
import {
    getIcon,
    isCollectNode,
    isPaginationNode,
    isRootNode,
    getTitle
} from '../helper'
import {
    ListSubheader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@material-ui/core'
import {
    isNextLinkPagination,
    isLinkListPagination
} from '../modules/common/pagination-helper'
import { useDispatch, useSelector } from 'react-redux'
import { setHighlightedNodeId } from 'actions/workflow'
import { AppState } from 'redux/store'
import { NodeType, WaitNode } from '@bitpull/worker/lib/typedefs'
import { truncate } from 'utils/text'

interface Props {
    node: Node
    onSelectNode: (node?: Node) => void
}

const getNodeLabel = (node: Node) => {
    const label = getTitle(node)

    if (isCollectNode(node)) {
        return node.fields?.length ? `${label}: ${node.fields.length} field(s)` : label
    } else if (isPaginationNode(node)) {
        let links
        if (isNextLinkPagination(node.pagination)) {
            links = node.pagination.nextLink.value
        } else if (isLinkListPagination(node.pagination)) {
            links = `${node.pagination.linkList.length} link(s)`
        }

        return `${label} to ${links}`
    } else if (node.type === NodeType.WAIT) {
        return `Wait ${(node as WaitNode).delay} seconds`
    } else if (isRootNode(node)) {
        return `${label} of ${node.link ? truncate(node.link) : node.linkedField}`
    }

    return label
}

const StepOverview: React.FC<Props> = ({ node, onSelectNode }) => {
    const dispatch = useDispatch()
    const highlightedNodeId = useSelector<AppState, string | undefined>(
        state => state.workflow.highlightedNodeId
    )
    const onHighlightNode = (highlightedNode?: Node) => {
        if (highlightedNodeId === highlightedNode?.id) return

        dispatch(
            setHighlightedNodeId(
                highlightedNode ? highlightedNode.id : undefined
            )
        )
    }

    return (
        <List
            subheader={
                <ListSubheader component="div">Next steps</ListSubheader>
            }
        >
            {node.children &&
                node.children.map((childNode: Node) => {
                    const Icon = getIcon(childNode.type)

                    return (
                        <ListItem
                            key={childNode.id}
                            button
                            onClick={() => {
                                onHighlightNode(undefined)
                                onSelectNode(childNode)
                            }}
                            onMouseOver={() => onHighlightNode(childNode)}
                            onMouseOut={() => onHighlightNode(undefined)}
                        >
                            <ListItemIcon>
                                <Icon />
                            </ListItemIcon>
                            <ListItemText primary={getNodeLabel(childNode)} />
                        </ListItem>
                    )
                })}
        </List>
    )
}

export default StepOverview
