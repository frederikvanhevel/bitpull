import React, { useEffect, useState } from 'react'
import {
    Grid,
    Typography,
    makeStyles,
    Theme,
    Divider,
    Paper
} from '@material-ui/core'
import { useSnackbar } from 'notistack'
import cx from 'classnames'
import PaddingWrapper from 'components/navigation/PaddingWrapper'
import { CheckCircle, RemoveCircle } from '@material-ui/icons'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { getPaymentDetails } from 'queries/payment/typedefs/getPaymentDetails'
import { GET_PAYMENT_DETAILS } from 'queries/payment'
import { Plan } from 'typedefs/graphql'
import { CHANGE_PLAN } from 'mutations/payment'
import LoadingButton from 'components/ui/buttons/LoadingButton'
import {
    changePlan,
    changePlanVariables
} from 'mutations/payment/typedefs/changePlan'
import PaymentDialog from 'components/payment/PaymentDialog'
import { StripeProvider, Elements } from 'react-stripe-elements'
import ErrorScreen from 'components/ui/ErrorScreen'
import NotificationBar from 'components/ui/NotificationBar'

const useStyles = makeStyles((theme: Theme) => ({
    grid: {
        justifyContent: 'center'
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
        padding: theme.spacing(5, 3),
        marginRight: theme.spacing(6),
        borderRadius: 10,
        transition: 'transform .2s ease'
    },
    selected: {
        transform: 'scale(1.05)'
    },
    popular: {
        position: 'absolute',
        top: 0,
        background: '#3ecf8e',
        color: 'white',
        fontWeight: 600,
        textTransform: 'uppercase',
        padding: theme.spacing(0, 1),
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    top: {
        marginBottom: theme.spacing(2),
        fontWeight: 600
    },
    currency: {
        fontSize: 20,
        verticalAlign: 'top',
        position: 'relative',
        top: 8
    },
    price: {
        fontWeight: 'bold',
        color: '#47495a'
    },
    bottom: {
        marginTop: theme.spacing(2),
        color: theme.palette.grey[600],
        fontWeight: 600
    },
    divider: {
        width: '100%',
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2)
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    check: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    icon: {
        marginRight: theme.spacing(1)
    },
    success: {
        '& > path': {
            fill: '#3ecf8e'
        }
    },
    error: {
        '& > path': {
            fill: '#ff7677'
        }
    },
    button: {
        marginTop: theme.spacing(2)
    },
    bold: {
        margin: '0 3px'
    }
}))

const PaymentPlanTab: React.FC = () => {
    const classes = useStyles()
    const [dialogOpen, setDialogOpen] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const { data, loading, error } = useQuery<getPaymentDetails>(
        GET_PAYMENT_DETAILS,
        {
            fetchPolicy: 'cache-and-network'
        }
    )

    const [
        update,
        { loading: loadingUpdate, error: updateError }
    ] = useMutation<changePlan, changePlanVariables>(CHANGE_PLAN)

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

    if (error) return <ErrorScreen />

    return (
        <StripeProvider apiKey={process.env.STRIPE_PUBLIC_KEY!}>
            <Elements>
                <>
                    {plan === Plan.METERED && credits > 0 && (
                        <NotificationBar type="success">
                            You still have{' '}
                            <strong className={classes.bold}>{credits}</strong>{' '}
                            free credits remaining. We will not bill you until
                            you run out of credits.
                        </NotificationBar>
                    )}

                    <PaddingWrapper>
                        <PaddingWrapper>
                            <Grid
                                container
                                spacing={3}
                                className={classes.grid}
                            >
                                <Grid item xs={5} md={5} lg={4} xl={3}>
                                    <Paper
                                        className={cx(classes.wrapper, {
                                            [classes.selected]:
                                                plan === Plan.METERED
                                        })}
                                        elevation={2}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            className={classes.top}
                                        >
                                            Usage Based
                                        </Typography>
                                        <Typography
                                            variant="h3"
                                            className={classes.price}
                                        >
                                            <span className={classes.currency}>
                                                $
                                            </span>
                                            0.00015
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            className={classes.bottom}
                                        >
                                            second
                                        </Typography>

                                        <Divider className={classes.divider} />

                                        <div className={classes.list}>
                                            <div className={classes.check}>
                                                <CheckCircle
                                                    className={cx(
                                                        classes.icon,
                                                        classes.success
                                                    )}
                                                />
                                                Unlimited workflows
                                            </div>
                                            <div className={classes.check}>
                                                <CheckCircle
                                                    className={cx(
                                                        classes.icon,
                                                        classes.success
                                                    )}
                                                />
                                                Unlimited jobs
                                            </div>
                                            <div className={classes.check}>
                                                <CheckCircle
                                                    className={cx(
                                                        classes.icon,
                                                        classes.success
                                                    )}
                                                />
                                                Scheduling
                                            </div>
                                            <div className={classes.check}>
                                                <CheckCircle
                                                    className={cx(
                                                        classes.icon,
                                                        classes.success
                                                    )}
                                                />
                                                Free storage
                                            </div>
                                            <div className={classes.check}>
                                                <CheckCircle
                                                    className={cx(
                                                        classes.icon,
                                                        classes.success
                                                    )}
                                                />
                                                30 day data retention
                                            </div>
                                            <div className={classes.check}>
                                                <CheckCircle
                                                    className={cx(
                                                        classes.icon,
                                                        classes.success
                                                    )}
                                                />
                                                All integrations
                                            </div>
                                            <div className={classes.check}>
                                                <RemoveCircle
                                                    className={cx(
                                                        classes.icon,
                                                        classes.error
                                                    )}
                                                />
                                                Anonymous proxy
                                            </div>
                                        </div>

                                        <LoadingButton
                                            color="primary"
                                            variant="contained"
                                            className={classes.button}
                                            disabled={
                                                plan === Plan.METERED ||
                                                loadingUpdate ||
                                                loading
                                            }
                                            loading={
                                                plan !== Plan.METERED &&
                                                loadingUpdate
                                            }
                                            onClick={() =>
                                                changePaymentPlan(Plan.METERED)
                                            }
                                        >
                                            {plan === Plan.METERED
                                                ? 'Current plan'
                                                : 'Choose plan'}
                                        </LoadingButton>
                                    </Paper>
                                </Grid>

                                <Grid item xs={5} md={5} lg={4} xl={3}>
                                    <Paper
                                        className={cx(classes.wrapper, {
                                            [classes.selected]:
                                                plan === Plan.MONTHLY
                                        })}
                                        elevation={2}
                                    >
                                        <Typography
                                            className={classes.popular}
                                            variant="caption"
                                        >
                                            Popular option
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            className={classes.top}
                                        >
                                            Monthly
                                        </Typography>
                                        <Typography
                                            variant="h3"
                                            className={classes.price}
                                        >
                                            <span className={classes.currency}>
                                                $
                                            </span>
                                            68
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            className={classes.bottom}
                                        >
                                            month
                                        </Typography>

                                        <Divider className={classes.divider} />

                                        <div className={classes.list}>
                                            <div className={classes.check}>
                                                <CheckCircle
                                                    className={cx(
                                                        classes.icon,
                                                        classes.success
                                                    )}
                                                />
                                                Unlimited workflows
                                            </div>
                                            <div className={classes.check}>
                                                <CheckCircle
                                                    className={cx(
                                                        classes.icon,
                                                        classes.success
                                                    )}
                                                />
                                                Unlimited jobs
                                            </div>
                                            <div className={classes.check}>
                                                <CheckCircle
                                                    className={cx(
                                                        classes.icon,
                                                        classes.success
                                                    )}
                                                />
                                                Scheduling
                                            </div>
                                            <div className={classes.check}>
                                                <CheckCircle
                                                    className={cx(
                                                        classes.icon,
                                                        classes.success
                                                    )}
                                                />
                                                Free storage
                                            </div>
                                            <div className={classes.check}>
                                                <CheckCircle
                                                    className={cx(
                                                        classes.icon,
                                                        classes.success
                                                    )}
                                                />
                                                30 day data retention
                                            </div>
                                            <div className={classes.check}>
                                                <CheckCircle
                                                    className={cx(
                                                        classes.icon,
                                                        classes.success
                                                    )}
                                                />
                                                All integrations
                                            </div>
                                            <div className={classes.check}>
                                                <CheckCircle
                                                    className={cx(
                                                        classes.icon,
                                                        classes.success
                                                    )}
                                                />
                                                Anonymous proxy
                                            </div>
                                        </div>

                                        <LoadingButton
                                            color="primary"
                                            variant="contained"
                                            className={classes.button}
                                            disabled={
                                                plan === Plan.MONTHLY ||
                                                loadingUpdate ||
                                                loading
                                            }
                                            loading={
                                                plan !== Plan.MONTHLY &&
                                                loadingUpdate
                                            }
                                            onClick={() => {
                                                hasCard
                                                    ? changePaymentPlan(
                                                          Plan.MONTHLY
                                                      )
                                                    : setDialogOpen(true)
                                            }}
                                        >
                                            {plan === Plan.MONTHLY
                                                ? 'Current plan'
                                                : 'Choose plan'}
                                        </LoadingButton>
                                    </Paper>
                                </Grid>
                            </Grid>

                            <PaymentDialog
                                title="Enter your credit card details"
                                open={dialogOpen}
                                canClose
                                onConfirm={() => {
                                    changePaymentPlan(Plan.MONTHLY)
                                    setDialogOpen(false)
                                }}
                                onClose={() => setDialogOpen(false)}
                            />
                        </PaddingWrapper>
                    </PaddingWrapper>
                </>
            </Elements>
        </StripeProvider>
    )
}

export default PaymentPlanTab
