import React from 'react'
import ScheduleIcon from '@material-ui/icons/Schedule'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    wrapper: {
        position: 'relative',
        width: 24,
        height: 24
    },
    scheduleIcon: {
        position: 'absolute'
    },
    addIcon: {
        position: 'relative',
        top: 10,
        left: 12,
        transform: 'scale(.6)'
    }
})

const AddScheduleIcon: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.wrapper}>
            <ScheduleIcon className={classes.scheduleIcon} />
            <AddIcon className={classes.addIcon} />
        </div>
    )
}

export default AddScheduleIcon
