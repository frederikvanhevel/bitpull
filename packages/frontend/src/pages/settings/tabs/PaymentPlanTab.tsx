import React, { useEffect, useState } from 'react'
import { Grid, makeStyles, Theme, Button } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import PaddingWrapper from 'components/navigation/PaddingWrapper'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { getPaymentDetails } from 'queries/payment/typedefs/getPaymentDetails'
import { GET_PAYMENT_DETAILS } from 'queries/payment'
import { Plan } from 'typedefs/graphql'
import { CHANGE_PLAN, CANCEL_PLAN } from 'mutations/payment'
import {
    changePlan,
    changePlanVariables
} from 'mutations/payment/typedefs/changePlan'
import PaymentDialog from 'components/payment/PaymentDialog'
import { StripeProvider, Elements } from 'react-stripe-elements'
import ErrorScreen from 'components/ui/ErrorScreen'
import NotificationBar from 'components/ui/NotificationBar'
import ConfirmDialog from 'components/ui/dialogs/ConfirmDialog'
import { cancelPlan } from 'mutations/payment/typedefs/cancelPlan'
import PaymentPlan from './plan/PaymentPlan'

const PLANS = [
    {
        plan: Plan.METERED,
        description: {
            title: 'Usage based',
            price: 0.1,
            quantity: 'per page',
            features: [
                'Unlimited workflows',
                'Unlimited jobs',
                'Scheduling',
                'Free storage',
                '30 day data retention',
                'All integrations'
            ],
            missingFeatures: ['IP rotation']
        }
    },
    {
        plan: Plan.SMALL,
        description: {
            title: 'Small',
            popular: true,
            price: 19,
            quantity: 'per month',
            pages: 500,
            features: [
                'Unlimited workflows',
                'Unlimited jobs',
                'Scheduling',
                'Free storage',
                '30 day data retention',
                'All integrations',
                'IP rotation'
            ],
            missingFeatures: []
        }
    },
    {
        plan: Plan.BUSINESS,
        description: {
            title: 'Business',
            price: 49,
            quantity: 'per month',
            pages: 1000,
            features: [
                'Unlimited workflows',
                'Unlimited jobs',
                'Scheduling',
                'Free storage',
                '30 day data retention',
                'All integrations',
                'IP rotation'
            ],
            missingFeatures: []
        }
    }
]

const useStyles = makeStyles((theme: Theme) => ({
    grid: {
        justifyContent: 'center'
    },
    cancelWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(4)
    },
    bold: {
        margin: '0 3px'
    },
    cancel: {
        color: theme.palette.error.light
    }
}))

const PaymentPlanTab: React.FC = () => {
    const classes = useStyles()
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
    const [chosenPlan, setChosenPlan] = useState<Plan>()
    const { enqueueSnackbar } = useSnackbar()
    const { data, error, refetch } = useQuery<getPaymentDetails>(
        GET_PAYMENT_DETAILS,
        {
            fetchPolicy: 'cache-and-network'
        }
    )
    const [
        update,
        { loading: loadingUpdate, error: updateError }
    ] = useMutation<changePlan, changePlanVariables>(CHANGE_PLAN)
    const [
        cancel,
        { loading: loadingCancel, error: cancelError }
    ] = useMutation<cancelPlan>(CANCEL_PLAN)

    const changePaymentPlan = (plan: Plan) => {
        update({
            variables: {
                plan
            },
            update: (cache, { data: mutationData }) => {
                if (!mutationData) return

                const result = cache.readQuery<getPaymentDetails>({
                    query: GET_PAYMENT_DETAILS
                })

                if (!result) return

                cache.writeQuery<getPaymentDetails>({
                    query: GET_PAYMENT_DETAILS,
                    data: {
                        getPaymentDetails: {
                            ...result.getPaymentDetails,
                            plan
                        }
                    }
                })
            }
        })
    }

    const plan = data?.getPaymentDetails.plan
    const credits = data?.getPaymentDetails.credits || 0
    const hasCard =
        data?.getPaymentDetails.sourceBrand &&
        data?.getPaymentDetails.sourceLast4

    useEffect(() => {
        if (updateError) {
            enqueueSnackbar(
                'There was an error changing your plan. Please try again later.',
                {
                    variant: 'error'
                }
            )
        }
    }, [updateError])

    useEffect(() => {
        if (cancelError) {
            enqueueSnackbar(
                'There was an error cancelling your plan. Please try again later.',
                {
                    variant: 'error'
                }
            )
        }
    }, [cancelError])

    if (error) return <ErrorScreen />

    return (
        <StripeProvider apiKey={process.env.STRIPE_PUBLIC_KEY!}>
            <Elements>
                <>
                    {plan === Plan.METERED && credits > 0 && (
                        <NotificationBar type="success">
                            You still have{' '}
                            <strong className={classes.bold}>{credits}</strong>{' '}
                            free pages remaining. We will not bill you until you
                            run out of pages.
                        </NotificationBar>
                    )}

                    <PaddingWrapper>
                        <PaddingWrapper>
                            <Grid
                                container
                                spacing={3}
                                className={classes.grid}
                            >
                                {PLANS.map(p => (
                                    <PaymentPlan
                                        plan={p.plan}
                                        currentPlan={plan!}
                                        description={p.description}
                                        loading={
                                            loadingUpdate &&
                                            chosenPlan === p.plan
                                        }
                                        onChoose={newPlan => {
                                            setChosenPlan(newPlan)

                                            if (
                                                (plan === Plan.METERED ||
                                                    plan === Plan.FREE) &&
                                                hasCard
                                            ) {
                                                changePaymentPlan(newPlan)
                                            } else if (hasCard) {
                                                setConfirmDialogOpen(true)
                                            } else {
                                                setPaymentDialogOpen(true)
                                            }
                                        }}
                                    />
                                ))}

                                {plan !== Plan.FREE && (
                                    <Grid item xs={12} md={12} lg={12} xl={12}>
                                        <div className={classes.cancelWrapper}>
                                            <Button
                                                size="small"
                                                className={classes.cancel}
                                                disabled={loadingCancel}
                                                onClick={() => {
                                                    setChosenPlan(undefined)
                                                    setConfirmDialogOpen(true)
                                                }}
                                            >
                                                Cancel {plan} plan
                                            </Button>
                                        </div>
                                    </Grid>
                                )}
                            </Grid>

                            <PaymentDialog
                                title="Enter your credit card details"
                                open={paymentDialogOpen}
                                canClose
                                onConfirm={() => {
                                    changePaymentPlan(chosenPlan!)
                                    setChosenPlan(undefined)
                                    setPaymentDialogOpen(false)
                                }}
                                onClose={() => {
                                    setChosenPlan(undefined)
                                    setPaymentDialogOpen(false)
                                }}
                            />
                        </PaddingWrapper>
                    </PaddingWrapper>

                    <ConfirmDialog
                        title={`Are you sure you want to ${
                            chosenPlan ? 'change' : 'cancel'
                        } your plan?`}
                        open={confirmDialogOpen}
                        loading={chosenPlan ? loadingUpdate : loadingCancel}
                        disabled={chosenPlan ? loadingUpdate : loadingCancel}
                        onConfirm={async () => {
                            if (chosenPlan) {
                                changePaymentPlan(chosenPlan)
                            } else {
                                await cancel()
                                await refetch()
                            }

                            setConfirmDialogOpen(false)
                        }}
                        onClose={() => {
                            setConfirmDialogOpen(false)
                            setChosenPlan(undefined)
                        }}
                    >
                        You will still be charged for this month.
                    </ConfirmDialog>
                </>
            </Elements>
        </StripeProvider>
    )
}

export default PaymentPlanTab
