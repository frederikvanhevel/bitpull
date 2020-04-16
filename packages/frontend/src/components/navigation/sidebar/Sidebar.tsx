import React from 'react'
import { makeStyles, Drawer, Divider } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { AppState } from 'redux/store'
import { Link } from 'react-router-dom'
import { MainListItems, SecondaryListItems, BottomListItems } from './MenuItems'
import Logo from '../../ui/Logo'

export const SIDEBAR_WIDTH = 240

const useStyles = makeStyles(theme => ({
    logo: {
        width: '100%',
        height: '100%',
        marginTop: theme.spacing(1)
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: SIDEBAR_WIDTH,
        minHeight: 600,
        backgroundColor: '#203656'
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0 8px',
        paddingLeft: theme.spacing(2),
        ...theme.mixins.toolbar,
        background: 'rgb(0,0,0, 0.2)',
        '& img': {
            height: 30
        }
    },
    activeLink: {
        color: 'red'
    },
    divider: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
    }
}))

const Sidebar: React.FC = () => {
    const classes = useStyles()
    const isSidebarOpen = useSelector(
        (state: AppState) => state.layout.isSidebarOpen
    )

    return (
        <Drawer
            variant="permanent"
            classes={{
                paper: classes.drawerPaper
            }}
            open={isSidebarOpen}
        >
            <div className={classes.toolbarIcon}>
                <Link to="/">
                    <Logo />
                </Link>
            </div>
            <Divider className={classes.divider} />
            <MainListItems />
            <Divider className={classes.divider} />
            <SecondaryListItems />

            <BottomListItems />
        </Drawer>
    )
}

export default Sidebar
