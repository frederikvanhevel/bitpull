import React from 'react'
import cx from 'classnames'
import { Typography, makeStyles } from '@material-ui/core'
import logo from './images/logo.svg'

type Props = {
    className?: string
}

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2)
    },
    logo: {
        height: 50
    },
    copy: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 44,
        marginLeft: 10
    },
    namePart: {
        color: '#fff'
    }
}))

const Logo: React.FC<Props> = ({ className }) => {
    const classes = useStyles()

    return (
        <div className={cx(classes.container, className)}>
            <img src={logo} className={classes.logo} />
            <Typography component="h1" variant="h5" className={classes.copy}>
                Bit<span className={classes.namePart}>pull</span>
            </Typography>
        </div>
    )
}

export default Logo
