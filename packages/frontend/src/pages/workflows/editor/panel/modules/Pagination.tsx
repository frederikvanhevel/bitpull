import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import {
    Theme,
    TextField,
    FormControl,
    InputLabel,
    Select
} from '@material-ui/core'
import { PaginationNode } from '@bitpull/worker/lib/typedefs'
import ExpandableOptionRow from 'components/ui/expandable/ExpandableOptionRow'
import Selector, { Attributes } from './common/Selector'
import { findUrlAncestor, isNodeType, getNewNode } from '../helper'
import { HTMLSelector } from '@bitpull/worker/lib/typedefs'
import {
    getMenuItems,
    PaginationStep,
    isLinkListPagination,
    isNextLinkPagination
} from './common/pagination-helper'
import { setHighlightedNodeId } from 'actions/workflow'
import { Node } from 'typedefs/common'
import { useDispatch } from 'react-redux'
import {
    NextLinkPagination,
    PaginationTypes
} from '@bitpull/worker/lib/nodes/processing/pagination/typedefs'

enum PaginationType {
    NEXT_LINK = 'nextLink',
    LINK_LIST = 'linkList'
}

interface Props {
    node: PaginationNode
    onUpdate: (key: string, value: any) => void
    onAdd: (node: Node, extraProps?: object) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    pages: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing(2),
        padding: theme.spacing(4, 2),
        '& > div:first-child': {
            flexBasis: '48%'
        },
        '& > div:last-child': {
            flexBasis: '48%'
        }
    },
    select: {
        display: 'flex',
        alignItems: 'center'
    },
    expand: {
        padding: `0 ${theme.spacing(2)}px`
    },
    linkLimit: {
        padding: `0 ${theme.spacing(2)}px`,
        marginTop: theme.spacing(2),
        background: theme.palette.grey['100']
    },
    inlineInput: {
        display: 'flex',
        alignItems: 'center',
        background: theme.palette.grey['100'],
        '& > div': {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1)
        },
        '& input': {
            width: 50,
            padding: theme.spacing(1)
        }
    }
}))

const getInitialPanel = (pagination: PaginationTypes) => {
    if (isNextLinkPagination(pagination)) return PaginationType.NEXT_LINK
    else if (isLinkListPagination(pagination)) return PaginationType.LINK_LIST
}

const Pagination: React.FC<Props> = ({ node, onUpdate, onAdd }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [pagination, setPagination] = useState(
        node.pagination || { nextLink: '' }
    )
    const [activePanel, setActivePanel] = useState<PaginationType | undefined>(
        getInitialPanel(pagination)
    )
    const urlAncestor = findUrlAncestor(node)
    const updatePagination = (key: string, value: any) => {
        onUpdate('pagination', { ...pagination, [key]: value })
    }
    const onHighLightNode = (highlightedNode?: Node) =>
        dispatch(
            setHighlightedNodeId(
                highlightedNode ? highlightedNode.id : undefined
            )
        )
    const selectNextNode = (destination: string, nodeIdOrType: any) => {
        if (isNodeType(nodeIdOrType)) {
            const newNode = getNewNode(nodeIdOrType)
            onAdd(newNode, { [destination]: newNode.id })
        } else {
            onUpdate(destination, nodeIdOrType)
        }
        setHighlightedNodeId(undefined)
    }

    useEffect(() => {
        if (node.pagination) setPagination(node.pagination)
    }, [node])

    return (
        <div>
            <ExpandableOptionRow
                className={classes.expand}
                title="Next page link"
                active={activePanel === PaginationType.NEXT_LINK}
                onChange={() => setActivePanel(PaginationType.NEXT_LINK)}
            >
                <Selector
                    label="Next page selector"
                    selector={(pagination as NextLinkPagination).nextLink}
                    urlAncestor={urlAncestor}
                    defaultAttribute={Attributes.HREF}
                    onUpdate={(selector: HTMLSelector) => {
                        updatePagination('linkList', undefined)
                        updatePagination('nextLink', {
                            attribute: 'href',
                            ...selector
                        })
                    }}
                />
            </ExpandableOptionRow>

            {/* <ExpandableOptionRow
                className={classes.expand}
                title="List of links"
                active={activePanel === PaginationType.LINK_LIST}
                onChange={() => setActivePanel(PaginationType.LINK_LIST)}
            >
                <ListInput
                    links={node.linkList}
                    isRelative
                    onChange={links => {
                        updatePagination('nextLink', undefined)
                        updatePagination('linkList', links)
                    }}
                />
            </ExpandableOptionRow> */}

            <ExpandableOptionRow
                className={classes.linkLimit}
                title="Limit amount of links"
                active={node.linkLimit !== undefined}
                onChange={e => {
                    onUpdate('linkLimit', e.target.checked ? 100 : undefined)
                }}
            >
                <div className={classes.inlineInput}>
                    Limit amount of links to{' '}
                    <TextField
                        value={node.linkLimit}
                        variant="outlined"
                        type="number"
                        error={isNaN(Number(node.linkLimit))} // eslint-disable-line
                        onChange={e =>
                            onUpdate(
                                'linkLimit',
                                e.target.value
                                    ? Math.abs(Number(e.target.value))
                                    : e.target.value
                            )
                        }
                    />{' '}
                    pages
                </div>
            </ExpandableOptionRow>

            <div className={classes.pages}>
                <FormControl>
                    <InputLabel>For every page go to</InputLabel>
                    <Select
                        required
                        classes={{ select: classes.select }}
                        value={node.goToPerPage || ''}
                        onClose={() => onHighLightNode(undefined)}
                        onChange={e => {
                            onHighLightNode(undefined)
                            selectNextNode('goToPerPage', e.target.value)
                        }}
                    >
                        {getMenuItems(
                            node,
                            PaginationStep.PER_PAGE,
                            onHighLightNode
                        )}
                    </Select>
                </FormControl>

                <FormControl>
                    <InputLabel>At end go to</InputLabel>
                    <Select
                        required
                        classes={{ select: classes.select }}
                        value={node.gotoOnEnd || ''}
                        onClose={() => onHighLightNode(undefined)}
                        onChange={e => {
                            onHighLightNode(undefined)
                            selectNextNode('gotoOnEnd', e.target.value)
                        }}
                    >
                        {getMenuItems(
                            node,
                            PaginationStep.END,
                            onHighLightNode
                        )}
                    </Select>
                </FormControl>
            </div>
        </div>
    )
}

export default Pagination
