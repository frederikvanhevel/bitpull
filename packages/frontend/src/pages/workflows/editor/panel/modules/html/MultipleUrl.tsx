import React, { useState } from 'react'
import { makeStyles, Button } from '@material-ui/core'
import { FlowNode, MultipleHtmlNode } from '@bitpull/worker/lib/typedefs'
import { Node } from 'typedefs/common'
import UrlInputDialog from './UrlInputDialog'

interface Props {
    node: Node<MultipleHtmlNode>
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
    }
}))

const MultipleUrl: React.FC<Props> = ({ node, onUpdate }) => {
    const classes = useStyles()
    const [dialogOpen, setDialogOpen] = useState(false)
    const count = node.links?.length || 0

    const onConfirm = (links: string[]) => {
        setDialogOpen(false)
        onUpdate('links', links)
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
                <UrlInputDialog
                    open={dialogOpen}
                    links={node.links}
                    onConfirm={onConfirm}
                    onClose={() => setDialogOpen(false)}
                />
            </div>
        </div>
    )
}

export default MultipleUrl
