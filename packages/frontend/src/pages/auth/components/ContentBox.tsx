import React from 'react'
import { makeStyles } from '@material-ui/core'
import Logo from 'components/ui/Logo'

type Props = {
    showLogo?: boolean
}

const useStyles = makeStyles(() => ({
    paper: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 440,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
}))

const ContentBox: React.FC<Props> = ({ children, showLogo = true }) => {
    const classes = useStyles()

    return (
        <div className={classes.paper}>
            {showLogo && <Logo />}

            {children}
        </div>
    )
}

export default ContentBox
