import React, { useState } from 'react'
import {
    Typography,
    Button,
    makeStyles,
    CircularProgress,
    Theme
} from '@material-ui/core'
import { StripeProvider, Elements } from 'react-stripe-elements'
import { useQuery } from '@apollo/react-hooks'
import { GET_PAYMENT_DETAILS } from 'queries/payment'
import { getPaymentDetails } from 'queries/payment/typedefs/getPaymentDetails'
import PaymentDialog from 'components/payment/PaymentDialog'

const useStyles = makeStyles((theme: Theme) => ({
    row: {
        display: 'flex',
        alignItems: 'center'
    },
    cardText: {
        marginRight: theme.spacing(2)
    }
}))

const CardSection: React.FC = () => {
    const classes = useStyles()
    const [dialogOpen, setDialogOpen] = useState(false)
    const { data, loading, error, refetch } = useQuery<getPaymentDetails>(
        GET_PAYMENT_DETAILS,
        {
            fetchPolicy: 'cache-and-network'
        }
    )

    if (loading && !data) return <CircularProgress />
    if (error || !data) {
        return <Typography color="error">Something went wrong</Typography>
    }

    const hasCard =
        data.getPaymentDetails.sourceBrand && data.getPaymentDetails.sourceLast4

    return (
        <StripeProvider apiKey={process.env.STRIPE_PUBLIC_KEY!}>
            <Elements>
                <div className={classes.row}>
                    {hasCard && (
                        <Typography className={classes.cardText}>
                            {data.getPaymentDetails.sourceBrand} ending in{' '}
                            <strong>
                                {data.getPaymentDetails.sourceLast4}
                            </strong>
                        </Typography>
                    )}
                    <Button color="primary" onClick={() => setDialogOpen(true)}>
                        {hasCard
                            ? 'Update card'
                            : 'Add your payment information'}
                    </Button>
                    <PaymentDialog
                        title="Enter your credit card details"
                        open={dialogOpen}
                        canClose
                        onConfirm={() => {
                            refetch()
                            setDialogOpen(false)
                        }}
                        onClose={() => setDialogOpen(false)}
                    />
                </div>
            </Elements>
        </StripeProvider>
    )
}

export default CardSection
