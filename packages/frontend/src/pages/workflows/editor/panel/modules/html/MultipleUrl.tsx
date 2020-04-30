import React, { useState } from 'react'
import {
    makeStyles,
    Button,
    FormControl,
    InputLabel,
    Select
} from '@material-ui/core'
import { FlowNode, MultipleHtmlNode } from '@bitpull/worker/lib/typedefs'
import { Node } from 'typedefs/common'
import UrlInputDialog from './UrlInputDialog'
import { useDispatch } from 'react-redux'
import { setHighlightedNodeId } from 'actions/workflow'
import { isNodeType, getNewNode } from '../../helper'
import { getMenuItems, BranchStep } from '../common/branch-helper'

interface Props {
    node: Node<MultipleHtmlNode>
    onAdd: (node: Node, extraProps?: object) => void
    onUpdate: (key: string, value: any) => void
    onReplace: (node: FlowNode) => void
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        '& > div:not(:last-child)': {
            marginBottom: theme.spacing(1)
        }
    },
    inline: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    count: {
        marginRight: theme.spacing(1)
    },
    button: {
        marginLeft: theme.spacing(2)
    },
    inlineInput: {
        display: 'flex',
        alignItems: 'center',
        '& > div': {
            width: '100%'
        }
    },
    select: {
        display: 'flex',
        alignItems: 'center'
    }
}))

const MultipleUrl: React.FC<Props> = ({ node, onAdd, onUpdate }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [dialogOpen, setDialogOpen] = useState(false)
    const count = node.links?.length || 0

    const onConfirm = (links: string[]) => {
        setDialogOpen(false)
        onUpdate('links', links)
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

    return (
        <div className={classes.wrapper}>
            <div className={classes.inline}>
                <strong className={classes.count}>{count} </strong>
                {count === 1 ? ' link' : ' links'} added
                <Button
                    color="primary"
                    className={classes.button}
                    onClick={() => setDialogOpen(true)}
                >
                    {!count ? 'Add' : 'Edit'} links
                </Button>
            </div>

            <div className={classes.inlineInput}>
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

            <UrlInputDialog
                open={dialogOpen}
                links={node.links}
                onConfirm={onConfirm}
                onClose={() => setDialogOpen(false)}
            />
        </div>
    )
}

export default MultipleUrl
