import React from 'react'
import { Button } from '@material-ui/core'
import { useQuery } from '@apollo/react-hooks'
import { hasPaymentMethod } from 'queries/user/typedefs/hasPaymentMethod'
import { HAS_PAYMENT_METHOD } from 'queries/payment'
import { Link } from 'react-router-dom'
import NotificationBar from 'components/ui/NotificationBar'

const PaymentWarning: React.FC = () => {
    const { data, loading } = useQuery<hasPaymentMethod>(HAS_PAYMENT_METHOD, {
        fetchPolicy: 'cache-and-network'
    })

    if (loading || data?.hasPaymentMethod === true) return null

    return (
        <NotificationBar type="error" top={64}>
            You have run out of free credits. You need to add your credit card
            information to resume your jobs
            <Button
                component={Link}
                to="/settings/payment"
                variant="contained"
                size="small"
            >
                Add card
            </Button>
        </NotificationBar>
    )
}

export default PaymentWarning
