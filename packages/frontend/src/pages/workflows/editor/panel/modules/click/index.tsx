import React from 'react'
import { makeStyles } from '@material-ui/core'
import Selector from '../common/Selector'
import {
    HTMLSelector,
    FlowNode,
    NodeType,
    MultipleClickNode
} from '@bitpull/worker/lib/typedefs'
import { ClickNode } from '@bitpull/worker/lib/typedefs'
import ExpandableOptionRow from 'components/ui/expandable/ExpandableOptionRow'
import { Node } from 'typedefs/common'
import MultipleClick from './MultipleClick'
import { isMultipleClickNode } from '../../helper'
import TestRunWarning from '../common/TestRunWarning'

interface Props {
    node: Node<ClickNode> | Node<MultipleClickNode>
    onAdd: (node: Node, extraProps?: object) => void
    onUpdate: (key: string, value: any) => void
    onReplace: (node: FlowNode) => void
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        padding: theme.spacing(3)
    },
    expand: {
        padding: `0 ${theme.spacing(2)}px`,
        marginBottom: theme.spacing(2)
    },
    inlineInput: {
        display: 'flex',
        alignItems: 'center',
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

const ClickModule: React.FC<Props> = ({ node, onAdd, onUpdate, onReplace }) => {
    const classes = useStyles()

    return (
        <>
            <div className={classes.wrapper}>
                <Selector
                    label="Selected element"
                    selector={{ value: node.selector }}
                    node={node}
                    withAttribute={false}
                    onUpdate={(selector: HTMLSelector) =>
                        onUpdate('selector', selector.value)
                    }
                />
            </div>

            <ExpandableOptionRow
                className={classes.expand}
                title="Perform multiple clicks"
                active={node.type === NodeType.CLICK_MULTIPLE}
                onChange={() => {
                    onReplace({
                        ...node,
                        type:
                            node.type === NodeType.CLICK_MULTIPLE
                                ? NodeType.CLICK
                                : NodeType.CLICK_MULTIPLE
                    })
                }}
            >
                <MultipleClick
                    node={node as MultipleClickNode}
                    onAdd={onAdd}
                    onUpdate={onUpdate}
                />
            </ExpandableOptionRow>

            {isMultipleClickNode(node) && <TestRunWarning unit="clicks" />}
        </>
    )
}

export default ClickModule
