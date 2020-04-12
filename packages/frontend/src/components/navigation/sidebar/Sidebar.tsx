import React from 'react'
import { makeStyles, Drawer, Divider } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { AppState } from 'redux/store'
import { Link } from 'react-router-dom'
import { MainListItems, SecondaryListItems } from './MenuItems'
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
        backgroundColor: '#203656'
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        '& > h6': {
            marginLeft: theme.spacing(1)
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
                    {/* <Typography variant="h5">BitPull</Typography> */}
                    <Logo />
                </Link>
                {/* <IconButton onClick={() => dispatch(closeSidebar())}>
                    <ChevronLeft />
                </IconButton> */}
            </div>
            <Divider className={classes.divider} />
            <MainListItems />
            <Divider className={classes.divider} />
            <SecondaryListItems />
        </Drawer>
    )
}

export default Sidebar
