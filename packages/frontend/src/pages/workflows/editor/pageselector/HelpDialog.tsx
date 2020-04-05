import React from 'react'
import { makeStyles } from '@material-ui/styles'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Theme
} from '@material-ui/core'

interface Props {
    open: boolean
    onClose: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
    dialog: {
        zIndex: 10000 // !important'
    },
    green: {
        color: 'green'
    },
    yellow: {
        color: 'yellow',
        background: theme.palette.grey[600]
    },
    red: {
        color: 'red'
    }
}))

const HelpDialog: React.FC<Props> = ({ open, onClose }) => {
    const classes = useStyles()

    return (
        <Dialog
            open={open}
            onClose={onClose}
            classes={{ root: classes.dialog }}
        >
            <DialogTitle>Instructions</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <p>
                        Click on a page element that you would like your
                        selector to match (it will turn{' '}
                        <span className={classes.green}>green</span>).
                    </p>
                    <p>
                        The tool will then generate a minimal CSS selector for
                        that element, and will highlight (
                        <span className={classes.yellow}>yellow</span>)
                        everything that is matched by the selector.
                    </p>
                    <p>
                        Now click on a highlighted element to reject it (
                        <span className={classes.red}>red</span>), or click on
                        an unhighlighted element to add it (green).
                    </p>
                    {/* <p>
                        Holding 'shift' while moving the mouse will let you
                        select elements inside of other selected elements.
                    </p> */}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Got it
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default HelpDialog
