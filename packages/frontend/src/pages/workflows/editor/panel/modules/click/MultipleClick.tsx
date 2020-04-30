import React from 'react'
import { makeStyles, FormControl, InputLabel, Select } from '@material-ui/core'
import { MultipleClickNode } from '@bitpull/worker/lib/typedefs'
import { Node } from 'typedefs/common'
import { BranchStep, getMenuItems } from '../common/branch-helper'
import { setHighlightedNodeId } from 'actions/workflow'
import { isNodeType, getNewNode } from '../../helper'
import { useDispatch } from 'react-redux'

interface Props {
    node: Node<MultipleClickNode>
    onAdd: (node: Node, extraProps?: object) => void
    onUpdate: (key: string, value: any) => void
}

const useStyles = makeStyles(() => ({
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

const MultipleClick: React.FC<Props> = ({ node, onAdd, onUpdate }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
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
    )
}

export default MultipleClick
