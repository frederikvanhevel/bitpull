import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import { AppState } from 'redux/store'
import { history } from 'pages/router'
import { Button } from '@material-ui/core'
import { NotificationAction } from 'reducers/layout'

type Props = {
    label: string
    path: string
    onClick?: Function
}

const LinkButton: React.FC<Props> = ({ label, path, onClick }) => {
    return (
        <Button
            color="primary"
            size="small"
            onClick={() => {
                onClick && onClick()
                history.push(path)
            }}
        >
            {label}
        </Button>
    )
}

const getActionHandler = (onClose: Function, action?: NotificationAction) => {
    switch (action) {
        case NotificationAction.INTEGRATION_MISSING:
            return (
                <LinkButton
                    label="Fix"
                    path="/integrations"
                    onClick={onClose}
                />
            )
        case NotificationAction.INTEGRATION_INACTIVE:
            return (
                <LinkButton
                    label="Fix"
                    path="/integrations"
                    onClick={onClose}
                />
            )
        default:
            return undefined
    }
}

const Notifications: React.FC = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const notifications = useSelector(
        (state: AppState) => state.layout.notifications
    )

    useEffect(() => {
        if (notifications.length) {
            const { type, message, action } = notifications[0]

            enqueueSnackbar(message, {
                variant: type,
                action: (key: string) => {
                    const onClose = () => closeSnackbar(key)
                    return getActionHandler(onClose, action)
                }
            })
        }
    }, [notifications])

    return null
}

export default Notifications
