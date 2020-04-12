import React from 'react'
import cx from 'classnames'
import { makeStyles } from '@material-ui/core'
import Logo from 'components/ui/Logo'

type Props = {
    className?: string
    showLogo?: boolean
}

const useStyles = makeStyles(theme => ({
    paper: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 440,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    logoWrapper: {
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    }
}))

const ContentBox: React.FC<Props> = ({
    children,
    className,
    showLogo = true
}) => {
    const classes = useStyles()

    return (
        <div className={cx(classes.paper, className)}>
            {showLogo && (
                <div className={classes.logoWrapper}>
                    <Logo />
                </div>
            )}

            {children}
        </div>
    )
}

export default ContentBox
