import React from 'react'
import { Select, TextField, MenuItem, makeStyles } from '@material-ui/core'
import { DateTimePicker } from '@material-ui/pickers'

interface Props {
    time: Time
    onChange: (time: Time) => void
}

export interface Time {
    type: ScheduleType
    value: any
}

export enum ScheduleType {
    IMMEDIATELY = 'IMMEDIATELY',
    ONCE = 'ONCE',
    INTERVAL = 'INTERVAL',
    CRON = 'CRON'
}

const ScheduleTypeLabels: Record<ScheduleType, string> = {
    [ScheduleType.IMMEDIATELY]: 'Run immediately',
    [ScheduleType.ONCE]: 'Run once',
    [ScheduleType.INTERVAL]: 'Interval',
    [ScheduleType.CRON]: 'Cron'
}

const Defaults: Record<ScheduleType, any> = {
    [ScheduleType.IMMEDIATELY]: undefined,
    [ScheduleType.ONCE]: new Date(),
    [ScheduleType.INTERVAL]: '30 minutes',
    [ScheduleType.CRON]: ''
}

const IntervalLabels: Record<string, string> = {
    // '5 minutes': 'Every 5 minutes',
    // '10 minutes': 'Every 10 minutes',
    // '15 minutes': 'Every 15 minutes',
    '30 minutes': 'Every 30 minutes',
    '1 hours': 'Every hour',
    '3 hours': 'Every 3 hours',
    '12 hours': 'Every 12 hours',
    '1 days': 'Every day',
    '1 week': 'Every week'
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        marginTop: theme.spacing(2),
        '& > div:first-child': {
            width: 104,
            marginRight: theme.spacing(1)
        },
        '& > div:last-child': {
            width: 210
        },
        '& > div:only-child': {
            width: 322
        }
    }
}))

const TimeSelect: React.FC<Props> = ({ time, onChange }) => {
    const classes = useStyles()
    const onChangeType = (type: ScheduleType) => {
        onChange({
            type,
            value: Defaults[type]
        })
    }
    const onChangeValue = (value: any) => {
        onChange({
            type: time.type,
            value
        })
    }

    return (
        <div className={classes.wrapper}>
            <Select
                value={time.type}
                onChange={e => onChangeType(e.target.value as ScheduleType)}
            >
                {Object.values(ScheduleType).map(type => (
                    <MenuItem key={type} value={type}>
                        {ScheduleTypeLabels[type]}
                    </MenuItem>
                ))}
            </Select>

            {time.type === ScheduleType.INTERVAL && (
                <Select
                    value={time.value}
                    onChange={e => onChangeValue(e.target.value)}
                >
                    {Object.keys(IntervalLabels).map(type => (
                        <MenuItem key={type} value={type}>
                            {IntervalLabels[type]}
                        </MenuItem>
                    ))}
                </Select>
            )}

            {time.type === ScheduleType.ONCE && (
                <DateTimePicker
                    renderInput={props => <TextField {...props} />}
                    disablePast
                    value={time.value}
                    onChange={e => onChangeValue(e)}
                />
            )}

            {time.type === ScheduleType.CRON && (
                <TextField
                    value={time.value}
                    placeholder="0 2 * * *"
                    onChange={e => onChangeValue(e.target.value)}
                />
            )}
        </div>
    )
}

export default TimeSelect
