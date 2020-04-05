import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import {
    IconButton,
    Divider,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Menu,
    Theme
} from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'

interface Option {
    label: string
    icon?: JSX.Element
    disabled?: boolean
    divider?: boolean
    onClick: () => void
}

interface Divider {
    divider: boolean
}

interface Props {
    options: (Option | Divider)[]
}

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        marginRight: `-${theme.spacing(2)}px`
    }
}))

const MoreMenu: React.FC<Props> = ({ options }) => {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState<EventTarget & Element>()
    const open = Boolean(anchorEl)

    return (
        <div className={classes.wrapper}>
            <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
                <MoreVert />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(undefined)}
            >
                {options.map((option, i) => {
                    if (option.divider) {
                        return <Divider key={i} />
                    } else {
                        const item = option as Option

                        return (
                            <MenuItem
                                key={item.label || i}
                                disabled={item.disabled}
                                onClick={() => {
                                    setAnchorEl(undefined)
                                    item.onClick()
                                }}
                            >
                                {item.icon && (
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                )}
                                <ListItemText>{item.label}</ListItemText>
                            </MenuItem>
                        )
                    }
                })}
            </Menu>
        </div>
    )
}

export default MoreMenu
