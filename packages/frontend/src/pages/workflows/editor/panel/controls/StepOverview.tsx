import React from 'react'
import { Node } from 'typedefs/common'
import {
    getIcon,
    isCollectNode,
    isPaginationNode,
    getTitle,
    isHtmlNode,
    isLinkedHtmlNode,
    isMultipleHtmlNode
} from '../helper'
import {
    ListSubheader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { setHighlightedNodeId } from 'actions/workflow'
import { AppState } from 'redux/store'
import { NodeType, WaitNode } from '@bitpull/worker/lib/typedefs'
import { truncate } from 'utils/text'
import {
    isNextLinkPagination,
    isLinkListPagination
} from '../modules/common/pagination'

interface Props {
    node: Node
    onSelectNode: (node?: Node) => void
}

const getNodeLabel = (node: Node) => {
    const label = getTitle(node)

    if (isCollectNode(node)) {
        return node.fields?.length
            ? `${label}: ${node.fields.length} field(s)`
            : label
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
    } else if (isHtmlNode(node)) {
        return `${label} of ${truncate(node.link)}`
    } else if (isLinkedHtmlNode(node)) {
        return `${label} of ${node.linkedField}`
    } else if (isMultipleHtmlNode(node)) {
        return `${node.links?.length || 0} links`
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
