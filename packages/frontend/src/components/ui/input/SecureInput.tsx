import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import SecureInputDialog from '../dialogs/SecureInputDialog'

interface Props {
    value?: string
    name: string
    onUpdate: (encryptedText: string) => void
}

const SecureInput: React.FC<Props> = ({ value, name, onUpdate }) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const onConfirm = (encryptedText: string) => {
        onUpdate(encryptedText)
        setDialogOpen(false)
    }

    return (
        <>
            <Button
                variant="text"
                color="primary"
                onClick={() => setDialogOpen(true)}
            >
                {value ? 'Edit' : 'Set'} {name}
            </Button>

            <SecureInputDialog
                open={dialogOpen}
                onConfirm={onConfirm}
                onClose={() => setDialogOpen(false)}
            />
        </>
    )
}

export default SecureInput
