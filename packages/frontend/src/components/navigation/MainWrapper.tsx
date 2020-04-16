import React from 'react'
import { makeStyles } from '@material-ui/core'
import Header from './Header'
import MainContent from './MainContent'
import Sidebar from './sidebar/Sidebar'
import ErrorBoundary from './ErrorBoundary'

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        overflow: 'hidden',
        minWidth: 1024,
        position: 'relative',
        height: '100vh'
    }
}))

const MainWrapper: React.FC = ({ children }) => {
    const classes = useStyles()

    return (
        <div className={classes.wrapper}>
            <Header />
            <Sidebar />

            <ErrorBoundary withPadding>
                <MainContent>{children}</MainContent>
            </ErrorBoundary>
        </div>
    )
}

export default MainWrapper
