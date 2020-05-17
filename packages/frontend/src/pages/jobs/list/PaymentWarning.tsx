import React from 'react'
import { Button } from '@material-ui/core'
import { useQuery } from '@apollo/react-hooks'
import { HAS_REMAINING_CREDITS } from 'queries/payment'
import { Link } from 'react-router-dom'
import NotificationBar from 'components/ui/NotificationBar'
import { hasCreditsRemaining } from 'queries/payment/typedefs/hasCreditsRemaining'

const PaymentWarning: React.FC = () => {
    const { data, loading } = useQuery<hasCreditsRemaining>(HAS_REMAINING_CREDITS, {
        fetchPolicy: 'cache-and-network'
    })

    if (loading || data?.hasCreditsRemaining === true) return null

    return (
        <NotificationBar type="error" top={64}>
            You have reached your plan limit. Upgrade your plan to resume your jobs.
            {/* You have run out of free credits. You need to add your credit card
            information to resume your jobs */}
            <Button
                component={Link}
                to="/settings/plan"
                variant="contained"
                size="small"
            >
                Upgrade
            </Button>
        </NotificationBar>
    )
}

export default PaymentWarning
