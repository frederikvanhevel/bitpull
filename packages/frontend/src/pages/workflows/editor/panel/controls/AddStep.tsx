import React, { useState } from 'react'
import { makeStyles, Button, MenuItem, Menu } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { NodeMenuItem, getIcon } from '../helper'
import { NodeType } from '@bitpull/worker/lib/typedefs'

interface Props {
    label: string
    allowedChildNodes: NodeMenuItem[]
    onAddNode: (type: NodeType) => void
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
    menuItem: {
        '& > svg': {
            marginRight: theme.spacing(1)
        }
    }
}))

const AddStep: React.FC<Props> = ({ label, allowedChildNodes, onAddNode }) => {
    const classes = useStyles()
    const [anchor, setAnchor] = useState<EventTarget & Element>()

    return (
        <div className={classes.wrapper}>
            <Button
                variant="contained"
                color="primary"
                onClick={e => setAnchor(e.currentTarget)}
            >
                {label} <ExpandMoreIcon />
            </Button>
            <Menu
                anchorEl={anchor}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                getContentAnchorEl={null}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                open={!!anchor}
                onClose={() => setAnchor(undefined)}
            >
                {allowedChildNodes.map(option => {
                    const Icon = getIcon(option.type)

                    return (
                        <MenuItem
                            key={option.type}
                            className={classes.menuItem}
                            disabled={option.disabled}
                            onClick={() => {
                                setAnchor(undefined)
                                onAddNode(option.type)
                            }}
                        >
                            <ListItemIcon>
                                <Icon />
                            </ListItemIcon>{' '}
                            {option.label}
                        </MenuItem>
                    )
                })}
            </Menu>
        </div>
    )
}

export default AddStep
