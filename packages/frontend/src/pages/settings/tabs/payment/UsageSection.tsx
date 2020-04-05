import React from 'react'
import {
    Typography,
    makeStyles,
    CircularProgress,
    Theme,
    Button
} from '@material-ui/core'
import { useQuery } from '@apollo/react-hooks'
import { GET_USAGE_SUMMARY } from 'queries/payment'
import { getUsageSummary } from 'queries/payment/typedefs/getUsageSummary'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) => ({
    row: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    list: {
        width: '100%'
    },
    amount: {
        textAlign: 'right',
        marginRight: theme.spacing(2),
        '& > span': {
            fontWeight: '500'
        }
    },
    success: {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.contrastText,
        textTransform: 'uppercase'
    },
    inline: {
        display: 'flex',
        alignItems: 'center',
        '& > a': {
            marginLeft: theme.spacing(2)
        }
    }
}))

const UsageSection: React.FC = () => {
    const classes = useStyles()
    const { data, loading, error } = useQuery<getUsageSummary>(
        GET_USAGE_SUMMARY,
        {
            fetchPolicy: 'cache-and-network'
        }
    )

    if (loading && !data) return <CircularProgress />
    if (error || !data) {
        return <Typography color="error">Something went wrong</Typography>
    }

    if (!data.getUsageSummary) {
        return <Typography>No usage recorded for this period</Typography>
    }

    const { start, total } = data.getUsageSummary
    const credits = data.getPaymentDetails.credits

    return (
        <div className={classes.row}>
            <Typography>
                Your current usage for this period starting{' '}
                <strong>{format(new Date(start), 'd MMM yyyy')}</strong>
            </Typography>
            <br />
            <Typography>
                <strong>{total || 0}</strong> seconds billed this period
            </Typography>
            <br />
            <div className={classes.inline}>
                <Typography>
                    <strong>{credits || 0}</strong> free credits remaining
                </Typography>
                <Button color="primary" component={Link} to="/referral">
                    Earn more
                </Button>
            </div>
        </div>
    )
}

export default UsageSection
