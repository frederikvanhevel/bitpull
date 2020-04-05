import React, { useState } from 'react'
import { TextField, Typography } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'redux/store'
import ConfirmDialog from 'components/ui/dialogs/ConfirmDialog'
import { useMutation } from '@apollo/react-hooks'
import { cancelAccount } from 'mutations/user/typedefs/cancelAccount'
import { CANCEL_ACCOUNT } from 'mutations/user'
import { logout } from 'actions/user'

interface Props {
    open?: boolean
    onClose: () => void
}

const ConfirmCancelDialog: React.FC<Props> = ({ open, onClose }) => {
    const dispatch = useDispatch()
    const email = useSelector<AppState, string | undefined>(
        state => state.user.user?.email
    )
    const [cancel, { loading }] = useMutation<cancelAccount>(CANCEL_ACCOUNT, {
        onCompleted: () => dispatch(logout())
    })
    const [value, setValue] = useState<string>('')
    const isValidValue = () => value === email
    const onSubmit = async () => {
        if (!isValidValue()) return
        cancel()
    }

    return (
        <ConfirmDialog
            title="Close Account"
            confirmLabel="Cancel"
            open={!!open}
            disabled={!isValidValue()}
            loading={loading}
            maxWidth="xs"
            onConfirm={onSubmit}
            onClose={onClose}
        >
            <Typography>
                Cancelling your account will stop any further payment
                processing.
            </Typography>

            <br />

            <Typography>
                Your unused time and credits will expire at the end of the
                billing period.
            </Typography>

            <br />

            <TextField
                type="email"
                fullWidth
                placeholder="Type your email address to confirm"
                onChange={e => setValue(e.target.value)}
                autoComplete="off"
                autoFocus
            />
        </ConfirmDialog>
    )
}

export default ConfirmCancelDialog
