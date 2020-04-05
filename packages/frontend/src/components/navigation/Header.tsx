import React from 'react'
import { makeStyles, AppBar, Toolbar } from '@material-ui/core'
import UserMenu from './UserMenu'
import { Route } from 'react-router'
import { privateRoutes } from 'pages/router'
import BreadCrumb from './BreadCrumb'
import { SIDEBAR_WIDTH } from './sidebar/Sidebar'

export const HEADER_HEIGHT = 64

const useStyles = makeStyles(theme => ({
    toolbar: {
        borderBottom: '1px solid #e8e8e8',
        paddingRight: 24 // keep right padding when drawer closed
    },
    appBar: {
        marginLeft: SIDEBAR_WIDTH,
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        background: '#f9f9f9',
        zIndex: theme.zIndex.drawer + 1
    }
}))

const Header: React.FC = () => {
    const classes = useStyles()

    return (
        <AppBar position="absolute" className={classes.appBar} elevation={0}>
            <Toolbar className={classes.toolbar}>
                {privateRoutes.map(route => (
                    <Route
                        {...route}
                        key={route.path}
                        component={() => {
                            return (
                                <BreadCrumb
                                    label={route.label!}
                                    path={route.path}
                                />
                            )
                        }}
                    />
                ))}

                {/* <div>Current page</div> */}

                {/* <Breadcrumb /> */}

                {/* <IconButton color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton> */}
                <UserMenu />
            </Toolbar>
        </AppBar>
    )
}

export default Header
