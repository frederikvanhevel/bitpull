import React from 'react'
import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

type Props = {
    title?: string
    description?: string
}

const useStyles = makeStyles((theme: Theme) => ({
    centeredColumns: {
        margin: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: theme.palette.grey['500']
    },
    text: {
        margin: theme.spacing(2),
        color: theme.palette.grey['500']
    }
}))

const ErrorScreen: React.FC<Props> = ({
    children,
    title = 'Something went wrong!',
    description = 'We have been notified. In the meantime try reloading thepage.'
}) => {
    const classes = useStyles()

    return (
        <div className="container">
            <div className={classes.centeredColumns}>
                <Typography className={classes.title} variant="subtitle1">
                    {title}
                </Typography>

                <Typography className={classes.text}>{description}</Typography>

                <div>{children}</div>
            </div>
        </div>
    )
}

export default ErrorScreen
