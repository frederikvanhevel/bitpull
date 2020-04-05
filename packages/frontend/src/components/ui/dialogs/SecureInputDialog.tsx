import React, { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import { TextField, Typography, makeStyles } from '@material-ui/core'
import useEncryption from 'hooks/useEncryption'
import { Lock } from '@material-ui/icons'

interface Props {
    open?: boolean
    onConfirm: (encryptedText: string) => void
    onClose: () => void
}

const useStyles = makeStyles(theme => ({
    info: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: theme.spacing(2),
        '& svg': {
            fontSize: '16px',
            marginRight: theme.spacing(1) / 2,
            fill: theme.palette.secondary.main
        }
    }
}))

const SecureInputDialog: React.FC<Props> = ({ open, onConfirm, onClose }) => {
    const classes = useStyles()
    const { encrypt, loading } = useEncryption()
    const [value, setValue] = useState<string>()
    const isValidValue = () => !!value && value !== ''
    const onEncrypt = async () => {
        if (!isValidValue()) return
        const encrypted = await encrypt(value!)
        onConfirm(encrypted)
    }

    return (
        <ConfirmDialog
            title="Secure password input"
            confirmLabel="Encrypt"
            open={!!open}
            loading={loading}
            disabled={!isValidValue()}
            maxWidth="xs"
            onConfirm={onEncrypt}
            onClose={onClose}
            footer={
                <Typography variant="caption" className={classes.info}>
                    <Lock /> Your credentials are encrypted
                </Typography>
            }
        >
            <TextField
                type="password"
                fullWidth
                placeholder="Enter value"
                onChange={e => setValue(e.target.value)}
                autoComplete="off"
                autoFocus
            />
        </ConfirmDialog>
    )
}

export default SecureInputDialog
