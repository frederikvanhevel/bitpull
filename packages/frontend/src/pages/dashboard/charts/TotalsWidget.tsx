import React from 'react'
import cx from 'classnames'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { Theme, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        width: 240,
        height: 80
    },
    label: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        '& > span': {
            color: theme.palette.grey['500']
        },
        '& > h6': {
            marginBottom: `-${theme.spacing(1)}px`
        }
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80px',
        '& > svg': {
            fontSize: '40px'
        }
    },
    error: {
        '& svg': {
            fill: theme.palette.error.light
        }
    },
    success: {
        '& svg': {
            fill: theme.palette.success.light
        }
    },
    default: {
        '& svg': {
            fill: theme.palette.grey['500']
        }
    }
}))

type Props = {
    icon: JSX.Element
    total: number
    label: string
    status: 'default' | 'success' | 'error'
}

const TotalsWidget: React.FC<Props> = ({ icon, total, label, status }) => {
    const classes = useStyles()

    return (
        <Paper
            className={cx(classes.wrapper, {
                [classes.error]: status === 'error',
                [classes.success]: status === 'success',
                [classes.default]: status === 'default'
            })}
        >
            <div className={classes.icon}>{icon}</div>
            <div className={classes.label}>
                <Typography variant="h6">{total.toLocaleString()}</Typography>
                <Typography variant="overline">{label}</Typography>
            </div>
        </Paper>
    )
}

export default TotalsWidget
