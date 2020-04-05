import React, { useState } from 'react'
import {
    makeStyles,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@material-ui/core'
import { Person, ExitToApp, Settings, Redeem } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'redux/store'
import { logout } from 'actions/user'
import { User } from 'queries/user/typedefs'

const useStyles = makeStyles(theme => ({
    userMenu: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'pointer',
        padding: theme.spacing(1),
        '&:hover': {
            background: 'rgba(0,0,0,0.1)'
        }
    },
    picture: {
        marginLeft: theme.spacing(1),
        color: '#fff',
        cursor: 'pointer',
        '& > img': {
            width: 40,
            height: 40,
            borderRadius: '50%'
        }
    },
    email: {
        color: 'rgba(0, 0, 0, 0.54)'
    }
}))

const UserMenu: React.FC = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [anchor, setAnchor] = useState<EventTarget & Element>()
    const user = useSelector<AppState, User | undefined>(
        state => state.user.user
    )
    const doLogout = () => dispatch(logout())

    return (
        <>
            <div
                className={classes.userMenu}
                onClick={e => setAnchor(e.currentTarget)}
            >
                <Typography variant="body1" className={classes.email}>
                    {user?.firstName} {user?.lastName}
                </Typography>

                <div className={classes.picture}>
                    {user?.picture ? (
                        <img src={user.picture} />
                    ) : (
                        <Avatar>
                            <Person />
                        </Avatar>
                    )}
                </div>
            </div>
            <Menu
                anchorEl={anchor}
                open={!!anchor}
                onClose={() => setAnchor(undefined)}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
            >
                <MenuItem
                    onClick={() => setAnchor(undefined)}
                    component={Link}
                    to="/referral"
                >
                    <ListItemIcon>
                        <Redeem />
                    </ListItemIcon>{' '}
                    <ListItemText>Refer a friend</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => setAnchor(undefined)}
                    component={Link}
                    to="/settings"
                >
                    <ListItemIcon>
                        <Settings />
                    </ListItemIcon>{' '}
                    <ListItemText>Settings</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => doLogout()}>
                    <ListItemIcon>
                        <ExitToApp />
                    </ListItemIcon>{' '}
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>
        </>
    )
}

export default UserMenu
