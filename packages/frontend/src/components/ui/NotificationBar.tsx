import React from 'react'
import cx from 'classnames'
import { Typography, makeStyles, Theme } from '@material-ui/core'
import { Warning, CheckCircle, Error as ErrorIcon } from '@material-ui/icons'

type NotificationType = 'success' | 'warning' | 'error'

type Props = {
    type: NotificationType
    top?: number
}

const ICON_MAP: Record<NotificationType, any> = {
    success: CheckCircle,
    warning: Warning,
    error: ErrorIcon
}

const useStyles = makeStyles((theme: Theme) => ({
    bar: {
        position: 'relative',
        padding: theme.spacing(2, 3)
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        '& > svg': {
            marginRight: theme.spacing(1)
        },
        '& > a': {
            marginLeft: theme.spacing(2)
        }
    },
    success: {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.contrastText
    },
    warning: {
        backgroundColor: theme.palette.warning.light,
        color: theme.palette.warning.contrastText
    },
    error: {
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.contrastText
    }
}))

const NotificationBar: React.FC<Props> = ({ children, type, top }) => {
    const classes = useStyles()
    const Icon = ICON_MAP[type]

    return (
        <div
            className={cx(classes.bar, classes[type])}
            style={{ top: top || 0 }}
        >
            <Typography variant="body2" className={classes.content}>
                <Icon />
                {children}
            </Typography>
        </div>
    )
}

export default NotificationBar
