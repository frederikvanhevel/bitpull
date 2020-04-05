import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme, CircularProgress, Fab } from '@material-ui/core'
import { PlayArrow, Stop } from '@material-ui/icons'

interface Props {
    run: () => void
    cancel: () => void
    running: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    extendedIcon: {
        marginRight: theme.spacing(1),
        pointerEvents: 'none'
    },
    disabled: {
        color: 'rgba(0, 0, 0, 0.26)',
        boxShadow: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.12)'
    },
    hovering: {
        backgroundColor: theme.palette.error.light + ' !important'
    }
}))

const Runner: React.FC<Props> = ({ run, running, cancel }) => {
    const classes = useStyles()
    const [hovering, setHovering] = useState(false)

    return (
        <Fab
            variant="extended"
            color="primary"
            onClick={running ? cancel : run}
            onMouseOver={() => setHovering(true)}
            onMouseOut={() => setHovering(false)}
            classes={{
                root: running
                    ? hovering
                        ? classes.hovering
                        : classes.disabled
                    : undefined
            }}
        >
            {running ? (
                hovering ? (
                    <Stop className={classes.extendedIcon} />
                ) : (
                    <CircularProgress
                        size={16}
                        className={classes.extendedIcon}
                    />
                )
            ) : (
                <PlayArrow className={classes.extendedIcon} />
            )}{' '}
            {running ? (hovering ? 'Cancel' : 'Running') : 'Run test'}
        </Fab>
    )
}

export default Runner
