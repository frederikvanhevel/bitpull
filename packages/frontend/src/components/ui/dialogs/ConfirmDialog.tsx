import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    makeStyles,
    Theme
} from '@material-ui/core'
import LoadingButton from '../buttons/LoadingButton'

interface Props {
    open: boolean
    title: string
    cancelLabel?: string
    confirmLabel?: string
    loading?: boolean
    disabled?: boolean
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    footer?: JSX.Element
    onConfirm: () => void
    onClose: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
    actions: {
        justifyContent: 'space-between'
    },
    cancel: {
        marginRight: theme.spacing(1)
    }
}))

const ConfirmDialog: React.FC<Props> = ({
    children,
    open,
    title,
    cancelLabel = 'Cancel',
    confirmLabel = 'Confirm',
    loading,
    disabled,
    maxWidth = 'xs',
    footer,
    onClose,
    onConfirm
}) => {
    const classes = useStyles()

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={!!maxWidth}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{children}</DialogContentText>
            </DialogContent>
            <DialogActions classes={{ root: classes.actions }}>
                <div>{footer}</div>

                <div>
                    <Button
                        onClick={onClose}
                        color="primary"
                        className={classes.cancel}
                    >
                        {cancelLabel}
                    </Button>
                    <LoadingButton
                        variant="contained"
                        onClick={onConfirm}
                        color="primary"
                        autoFocus
                        loading={loading}
                        disabled={disabled || loading}
                    >
                        {confirmLabel}
                    </LoadingButton>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog
