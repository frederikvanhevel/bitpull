import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme, Typography } from '@material-ui/core'
import { Error } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) => ({
    warning: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        background: theme.palette.error.light,
        color: theme.palette.error.contrastText,
        padding: theme.spacing(2, 1),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        '& > svg': {
            marginRight: theme.spacing(1)
        },
        '& > p': {
            marginBottom: '0 !important'
        }
    }
}))

const Warning: React.FC = ({ children }) => {
    const classes = useStyles()

    return (
        <div className={classes.warning}>
            <Error />
            <Typography variant="body2">{children}</Typography>
        </div>
    )
}

export default Warning
