import React, { ElementType } from 'react'
import classnames from 'classnames'
import { makeStyles, Chip } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import RestoreIcon from '@material-ui/icons/Restore'
import PauseIcon from '@material-ui/icons/Pause'
// import { Error as ErrorIcon } from '@material-ui/icons'

export enum Status {
    FAILED = 'failed',
    COMPLETED = 'completed',
    COMPLETED_WITH_ERRORS = 'completed_with_errors',
    REPEATING = 'repeating',
    RUNNING = 'running',
    PAUSED = 'paused',
    QUEUED = 'queued',
    SCHEDULED = 'scheduled'
}

interface Props {
    status: Status
    repeatInterval?: string | null
    onClick?: () => void
}

const useStyles = makeStyles(theme => ({
    chip: {
        marginRight: theme.spacing(1)
    },
    chipLabel: {
        display: 'flex',
        alignItems: 'center'
    },
    running: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText
    },
    failed: {
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.contrastText
    },
    queued: {
        backgroundColor: '#50acfc',
        color: theme.palette.primary.contrastText
    },
    scheduled: {
        backgroundColor: '#50acfc',
        color: theme.palette.primary.contrastText
    },
    completed: {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.contrastText
    },
    completed_with_errors: {
        backgroundColor: theme.palette.warning.light,
        color: theme.palette.error.dark,
        '& svg': {
            color: theme.palette.error.light
        }
    },
    repeating: {
        backgroundColor: '#50acfc',
        color: theme.palette.primary.contrastText,
        '& svg': {
            color: theme.palette.tertiary.contrastText
        }
    },
    paused: {
        backgroundColor: theme.palette.grey['200']
    },
    extendedIcon: {
        marginLeft: `-${theme.spacing(1)}px`,
        marginRight: theme.spacing(1) / 2
    }
}))

const ICONS: Record<Status, ElementType | undefined> = {
    [Status.PAUSED]: PauseIcon,
    [Status.RUNNING]: CircularProgress,
    [Status.REPEATING]: RestoreIcon,
    [Status.FAILED]: undefined,
    [Status.COMPLETED]: undefined,
    [Status.COMPLETED_WITH_ERRORS]: undefined,
    [Status.QUEUED]: undefined,
    [Status.SCHEDULED]: undefined
}

const LABELS: Record<Status, string> = {
    [Status.PAUSED]: 'Paused',
    [Status.RUNNING]: 'Running',
    [Status.REPEATING]: 'Repeating',
    [Status.FAILED]: 'Failed',
    [Status.COMPLETED]: 'Completed',
    [Status.COMPLETED_WITH_ERRORS]: 'Completed',
    [Status.QUEUED]: 'Queued',
    [Status.SCHEDULED]: 'Scheduled'
}

const INTERVALS: Record<string, string> = {
    '5 minutes': 'Every 5 minutes',
    '10 minutes': 'Every 10 minutes',
    '15 minutes': 'Every 15 minutes',
    '30 minutes': 'Every 30 minutes',
    '1 hours': 'Every hour',
    '3 hours': 'Every 3 hours',
    '12 hours': 'Every 12 hours',
    '1 days': 'Every day',
    '1 week': 'Every week'
}

const StatusLabel: React.FC<Props> = ({ status, repeatInterval, onClick }) => {
    const classes = useStyles()
    const Icon = ICONS[status] || null
    const label = (
        <>
            {Icon ? <Icon size={16} className={classes.extendedIcon} /> : null}
            {status === Status.REPEATING && repeatInterval
                ? INTERVALS[repeatInterval]
                : LABELS[status]}
        </>
    )
    const chipProps: any = {}

    if (
        status === Status.FAILED ||
        status === Status.COMPLETED ||
        status === Status.COMPLETED_WITH_ERRORS
    ) {
        chipProps.onClick = onClick
    }

    return (
        <Chip
            classes={{
                // @ts-ignore
                root: classnames(classes.chip, classes[status.toLowerCase()]),
                label: classes.chipLabel
            }}
            label={label}
            {...chipProps}
        />
    )
}

export default StatusLabel
