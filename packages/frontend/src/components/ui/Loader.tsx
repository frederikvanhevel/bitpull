import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

interface Props {
    delay?: number
    text?: string
    subText?: string
    hideText?: boolean
    fullPage?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    fullPage: {
        height: '100vh',
        width: '100vw'
    },
    centeredColumns: {
        margin: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        margin: theme.spacing(2),
        color: theme.palette.grey['500']
    },
    subText: {
        margin: theme.spacing(2),
        marginTop: 0,
        color: theme.palette.grey['500']
    }
}))

const Loader: React.FC<Props> = ({
    children,
    text = 'Hang on, we are loading your data.',
    subText,
    hideText = false,
    delay = 500,
    fullPage = false
}) => {
    const classes = useStyles()
    const [shown, setShown] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShown(true)
        }, delay)

        return () => clearTimeout(timer)
    }, [])

    if (!shown) return null

    return (
        <div
            className={cx(classes.container, { [classes.fullPage]: fullPage })}
        >
            <div className={classes.centeredColumns}>
                <CircularProgress color="primary" size={40} />

                {!hideText && (
                    <Typography className={classes.text} variant="body2">
                        {text}
                    </Typography>
                )}

                {!hideText && !!subText && (
                    <Typography className={classes.subText} variant="caption">
                        {subText}
                    </Typography>
                )}

                <div>{children}</div>
            </div>
        </div>
    )
}

export default Loader
