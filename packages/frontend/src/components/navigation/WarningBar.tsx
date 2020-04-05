import React from 'react'
import { makeStyles } from '@material-ui/core'
import { AppState } from 'redux/store'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { SIDEBAR_WIDTH } from './sidebar/Sidebar'

const useStyles = makeStyles(theme => ({
    wrapper: {
        position: 'absolute',
        left: SIDEBAR_WIDTH,
        right: 0,
        top: 64,
        // height: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
        borderRadius: 0,
        zIndex: 1,
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        background: 'yellow'
    },
    sidebarClosed: {
        left: theme.spacing(9)
    }
}))

const WarningBar: React.FC = ({ children }) => {
    const classes = useStyles()
    const isSidebarOpen = useSelector(
        (state: AppState) => state.layout.isSidebarOpen
    )

    return (
        <div
            className={classNames(classes.wrapper, {
                [classes.sidebarClosed]: !isSidebarOpen
            })}
        >
            {children}
        </div>
    )
}

export default WarningBar
