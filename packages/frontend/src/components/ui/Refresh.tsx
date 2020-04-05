import React from 'react'
import format from 'date-fns/format'
import { Typography, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import RefreshIcon from '@material-ui/icons/Refresh'

type Props = {
    lastRefresh: Date
    onRefresh: () => void
}

const useStyles = makeStyles({
    lastRefresh: {
        display: 'flex',
        alignItems: 'center'
    }
})

const Refresh: React.FC<Props> = ({ lastRefresh, onRefresh }) => {
    const classes = useStyles()

    return (
        <div className={classes.lastRefresh}>
            <Typography variant="body2">
                Last updated {format(lastRefresh, 'h:mm:ss a')}
            </Typography>
            <IconButton onClick={onRefresh}>
                <RefreshIcon />
            </IconButton>
        </div>
    )
}

export default Refresh
