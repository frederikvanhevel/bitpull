import React from 'react'
import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

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

const ErrorScreen: React.FC = ({ children }) => {
    const classes = useStyles()

    return (
        <div className="container">
            <div className={classes.centeredColumns}>
                <Typography className={classes.title} variant="subtitle1">
                    Something went wrong!
                </Typography>

                <Typography className={classes.text}>
                    We have been notified. In the meantime try reloading the
                    page.
                </Typography>

                <div>{children}</div>
            </div>
        </div>
    )
}

export default ErrorScreen
