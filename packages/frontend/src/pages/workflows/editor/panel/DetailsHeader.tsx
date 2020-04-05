import React, { useState } from 'react'
import { Node } from 'typedefs/common'
import { makeStyles, AppBar, Typography, IconButton } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { getTitle, getIcon } from './helper'
import ConfirmDialog from 'components/ui/dialogs/ConfirmDialog'
import OptionsMenu from './controls/OptionsMenu'

interface Props {
    node: Node
    onClose: () => void
    onDeleteNode: () => void
    onToggleNode: () => void
}

const useStyles = makeStyles(theme => ({
    appBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        marginBottom: theme.spacing(2),
        zIndex: 100,
        '& > h6, & > button': { color: 'white' },
        '& > h6': {
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            '& > svg': {
                marginRight: theme.spacing(1)
            }
        }
    },
    actions: {
        display: 'flex',
        marginRight: `-${theme.spacing(2)}px`,
        '& button': {
            color: 'white',
            marginLeft: theme.spacing(1)
        }
    }
}))

const DetailsHeader: React.FC<Props> = ({
    node,
    onClose,
    onDeleteNode,
    onToggleNode
}) => {
    const classes = useStyles()
    const [dialogOpen, setDialogOpen] = useState(false)
    const Icon = getIcon(node.type)

    return (
        <AppBar position="static" className={classes.appBar}>
            <Typography variant="h6">
                {Icon && <Icon />}
                {getTitle(node)}
            </Typography>

            <div className={classes.actions}>
                {node.parent && (
                    <OptionsMenu
                        node={node}
                        onRemove={() => setDialogOpen(true)}
                        onDisable={onToggleNode}
                    />
                )}

                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </div>

            <ConfirmDialog
                title="Are you sure?"
                onClose={() => setDialogOpen(false)}
                onConfirm={() => {
                    onDeleteNode()
                    setDialogOpen(false)
                }}
                open={dialogOpen}
            >
                Removing this step will also remove all of it's next steps
            </ConfirmDialog>
        </AppBar>
    )
}

export default DetailsHeader
