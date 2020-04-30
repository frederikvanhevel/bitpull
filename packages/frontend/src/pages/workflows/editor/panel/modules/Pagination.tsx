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
import Selector from './common/Selector'
import { isNodeType, getNewNode } from '../helper'
import { HTMLSelector } from '@bitpull/worker/lib/typedefs'
import { getMenuItems, BranchStep } from './common/branch-helper'
import { setHighlightedNodeId } from 'actions/workflow'
import { Node } from 'typedefs/common'
import { useDispatch } from 'react-redux'
import { NextLinkPagination } from '@bitpull/worker/lib/nodes/processing/pagination/typedefs'
import { ArrowDownward } from '@material-ui/icons'
import TestRunWarning from './common/TestRunWarning'

interface Props {
    node: PaginationNode
    onUpdate: (key: string, value: any) => void
    onAdd: (node: Node, extraProps?: object) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        padding: theme.spacing(3),
        background: theme.palette.grey['100'],
        '& > div': {
            width: '100%'
        }
    },
    pages: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3),
        '& > div:first-child': {
            marginBottom: theme.spacing(4)
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
    },
    arrow: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: theme.spacing(2)
    }
}))

const Pagination: React.FC<Props> = ({ node, onUpdate, onAdd }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [pagination, setPagination] = useState(
        node.pagination || { nextLink: '' }
    )
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
        <>
            <div className={classes.wrapper}>
                <Selector
                    label="Next page button selector"
                    buttonLabel="Select next page button"
                    selector={(pagination as NextLinkPagination).nextLink}
                    node={node}
                    withAttribute={false}
                    onUpdate={(selector: HTMLSelector) => {
                        updatePagination('nextLink', selector)
                    }}
                />
            </div>

            <div className={classes.pages}>
                <FormControl>
                    <InputLabel>For every page do</InputLabel>
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
                            BranchStep.PER_PAGE,
                            onHighLightNode
                        )}
                    </Select>
                </FormControl>

                <div className={classes.arrow}>
                    <ArrowDownward />
                </div>

                <FormControl>
                    <InputLabel>Afterwards do (optional)</InputLabel>
                    <Select
                        required
                        classes={{ select: classes.select }}
                        value={node.goToOnEnd || ''}
                        onClose={() => onHighLightNode(undefined)}
                        onChange={e => {
                            onHighLightNode(undefined)
                            selectNextNode('goToOnEnd', e.target.value)
                        }}
                    >
                        {getMenuItems(node, BranchStep.END, onHighLightNode)}
                    </Select>
                </FormControl>
            </div>

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
                        error={isNaN(Number(node.linkLimit))}
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

            <TestRunWarning />
        </>
    )
}

export default Pagination
