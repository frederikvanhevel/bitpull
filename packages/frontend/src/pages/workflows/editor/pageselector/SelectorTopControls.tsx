import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import HelpIcon from '@material-ui/icons/Help'
import { Theme, Paper, Typography, IconButton, Button } from '@material-ui/core'
import HelpDialog from './HelpDialog'

interface Props {
    onConfirm: () => void
    onClear: () => void
    onClose: () => void
    currentSelector?: string
}

const useStyles = makeStyles((theme: Theme) => ({
    topBar: {
        height: '64px',
        minHeight: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
        borderRadius: 0,
        zIndex: 1,
        '& > div': {
            width: '33.333%'
        }
    },
    helpText: {
        display: 'flex',
        alignItems: 'center'
    },
    middle: {
        textAlign: 'center'
    },
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        '& > button': {
            marginLeft: theme.spacing(2),
            maxHeight: 34
        }
    },
    helpButton: {
        maxHeight: 'unset !important'
    }
}))

const SelectorTopControls: React.FC<Props> = ({
    onConfirm,
    onClear,
    onClose,
    currentSelector
}) => {
    const classes = useStyles()
    const [helpDialogOpen, setHelpDialogOpen] = useState(false)

    return (
        <Paper className={classes.topBar}>
            <div className={classes.helpText}>
                <Typography variant="body2">
                    Click elements to create your selector
                </Typography>
                <IconButton
                    onClick={() => setHelpDialogOpen(true)}
                    className={classes.helpButton}
                >
                    <HelpIcon />
                </IconButton>
            </div>

            <div className={classes.middle}>
                {currentSelector && (
                    <Typography variant="body2">
                        Selector: <b>{currentSelector}</b>
                    </Typography>
                )}
            </div>

            <div className={classes.buttonWrapper}>
                {currentSelector && (
                    <Button size="small" onClick={onClear}>
                        Clear
                    </Button>
                )}
                <Button variant="outlined" size="small" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={onConfirm}
                    disabled={!currentSelector}
                >
                    Accept
                </Button>
            </div>

            <HelpDialog
                open={helpDialogOpen}
                onClose={() => setHelpDialogOpen(false)}
            />
        </Paper>
    )
}

export default SelectorTopControls
