import React from 'react'
import cx from 'classnames'
import { makeStyles } from '@material-ui/core'
import logo from './images/logo-white-bg.svg'

type Props = {
    className?: string
}

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        alignItems: 'center'
    },
    logo: {
        height: 40
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
        </div>
    )
}

export default Logo
