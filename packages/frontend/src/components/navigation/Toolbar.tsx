import React from 'react'
import { makeStyles, Paper } from '@material-ui/core'
import { SIDEBAR_WIDTH } from './sidebar/Sidebar'

const useStyles = makeStyles(theme => ({
    wrapper: {
        position: 'absolute',
        left: SIDEBAR_WIDTH,
        right: 0,
        height: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
        borderRadius: 0,
        zIndex: 1,
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.08)'
    },
    tvMode: {
        left: 0,
        transition: 'unset'
    },
    buttonWrapper: {
        '& > button:first-child': {
            marginRight: theme.spacing(2)
        }
    }
}))

const Toolbar: React.FC = ({ children }) => {
    const classes = useStyles()

    return <Paper className={classes.wrapper}>{children}</Paper>
}

export default Toolbar
