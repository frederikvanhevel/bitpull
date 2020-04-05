import React from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto'
    }
}))

const MainContent: React.FC = ({ children }) => {
    const classes = useStyles()

    return (
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />

            {children}
        </main>
    )
}

export default MainContent
