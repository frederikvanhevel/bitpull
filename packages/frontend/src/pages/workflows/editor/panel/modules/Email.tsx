import React from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import { EmailNode } from '@bitpull/worker/lib/typedefs'
import { useSelector } from 'react-redux'
import { AppState } from 'redux/store'
import { User } from 'queries/user/typedefs'

interface Props {
    node: EmailNode
    onUpdate: (key: string, value: any) => void
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        padding: theme.spacing(3),
        '& > div': {
            width: '100%'
        },
        '& p': {
            marginBottom: theme.spacing(2)
        },
        minHeight: 105
    }
}))

const Email: React.FC<Props> = () => {
    const classes = useStyles()
    const user = useSelector<AppState, User | undefined>(
        state => state.user.user
    )

    return (
        <div className={classes.wrapper}>
            <Typography variant="h6">Get notified by email</Typography>
            <br />
            <Typography>
                Notifications will be sent to <strong>{user?.email}</strong>
            </Typography>
        </div>
    )
}

export default Email
