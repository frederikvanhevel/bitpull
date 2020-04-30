import React from 'react'
import { makeStyles, FormControlLabel, Switch } from '@material-ui/core'
import {
    HtmlNode,
    FlowNode,
    NodeType,
    LinkedHtmlNode,
    MultipleHtmlNode
} from '@bitpull/worker/lib/typedefs'
import { Node } from 'typedefs/common'
import SingleUrl from './SingleUrl'
import MultipleUrl from './MultipleUrl'
import { isMultipleHtmlNode, isHtmlNode, isRoot, isLinkedHtmlNode } from '../../helper'
import TestRunWarning from '../common/TestRunWarning'
import LinkedUrl from './LinkedUrl'

interface Props {
    node: Node<HtmlNode> | Node<LinkedHtmlNode> | Node<MultipleHtmlNode>
    onUpdate: (key: string, value: any) => void
    onReplace: (node: FlowNode) => void
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3)
    },
    switch: {
        marginBottom: theme.spacing(2)
    }
}))

const HtmlModule: React.FC<Props> = props => {
    const classes = useStyles()
    const { node, onReplace } = props
    const hasChildren = !!node.children && !!node.children.length
    const switchNode = () => {
        if (isMultipleHtmlNode(node)) {
            onReplace({
                type: NodeType.HTML,
                // @ts-ignore
                link: '' // TODO get first link
            })
        } else {
            onReplace({
                type: NodeType.HTML_MULTIPLE,
                // @ts-ignore
                links: [],
                goToPerPage: hasChildren ? node.children![0].id : undefined
            })
        }
    }

    console.log(isMultipleHtmlNode(node))

    return (
        <>
            <div className={classes.wrapper}>
                {isRoot(node) && (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isMultipleHtmlNode(node)}
                                onChange={() => switchNode()}
                                color="primary"
                            />
                        }
                        label="Go to multiple links"
                        className={classes.switch}
                    />
                )}

                {isHtmlNode(node) && <SingleUrl {...props} />}
                {isLinkedHtmlNode(node) && <LinkedUrl {...props} />}
                {isMultipleHtmlNode(node) && <MultipleUrl {...props} />}
            </div>

            {isMultipleHtmlNode(node) && <TestRunWarning />}
        </>
    )
}

export default HtmlModule
