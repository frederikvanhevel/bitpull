import React from 'react'
import { Theme, makeStyles } from '@material-ui/core'

interface Props {
    height?: number
    percentage: number
}

const useStyles = makeStyles((theme: Theme) => ({
    outer: {
        width: '100%',
        background: theme.palette.grey[200],
        borderRadius: 5
    },
    inner: {
        height: '100%',
        background: theme.palette.primary.main,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    }
}))

const ProgressBar: React.FC<Props> = ({ height = 10, percentage }) => {
    const classes = useStyles()

    return (
        <div className={classes.outer} style={{ height }}>
            <div
                className={classes.inner}
                style={{ width: `${percentage}%` }}
            />
        </div>
    )
}

export default ProgressBar
