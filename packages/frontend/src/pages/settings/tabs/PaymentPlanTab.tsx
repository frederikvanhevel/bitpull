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
import ConfirmDialog from 'components/ui/dialogs/ConfirmDialog'

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
    },
    pages: {
        marginRight: 4
    }
}))

const PaymentPlanTab: React.FC = () => {
    const classes = useStyles()
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [chosenPlan, setChosenPlan] = useState<Plan>()
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
                                            0.10
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            className={classes.bottom}
                                        >
                                            per page
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
                                                Unlimited pages
                                            </div>
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
                                                plan === Plan.METERED &&
                                                loadingUpdate
                                            }
                                            onClick={() =>
                                                setConfirmDialogOpen(true)
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
                                                plan === Plan.SMALL
                                        })}
                                        elevation={2}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            className={classes.top}
                                        >
                                            Small
                                        </Typography>
                                        <Typography
                                            variant="h3"
                                            className={classes.price}
                                        >
                                            <span className={classes.currency}>
                                                $
                                            </span>
                                            {19}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            className={classes.bottom}
                                        >
                                            per month
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
                                                <strong
                                                    className={classes.pages}
                                                >
                                                    500
                                                </strong>{' '}
                                                pages per month
                                            </div>
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
                                                plan === Plan.SMALL ||
                                                loadingUpdate ||
                                                loading
                                            }
                                            loading={
                                                plan === Plan.SMALL &&
                                                loadingUpdate
                                            }
                                            onClick={() => {
                                                hasCard
                                                    ? changePaymentPlan(
                                                          Plan.SMALL
                                                      )
                                                    : setChosenPlan(Plan.SMALL)
                                            }}
                                        >
                                            {plan === Plan.SMALL
                                                ? 'Current plan'
                                                : 'Choose plan'}
                                        </LoadingButton>
                                    </Paper>
                                </Grid>

                                <Grid item xs={5} md={5} lg={4} xl={3}>
                                    <Paper
                                        className={cx(classes.wrapper, {
                                            [classes.selected]:
                                                plan === Plan.BUSINESS
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
                                            Business
                                        </Typography>
                                        <Typography
                                            variant="h3"
                                            className={classes.price}
                                        >
                                            <span className={classes.currency}>
                                                $
                                            </span>
                                            {49}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            className={classes.bottom}
                                        >
                                            per month
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
                                                <strong
                                                    className={classes.pages}
                                                >
                                                    1000
                                                </strong>{' '}
                                                pages per month
                                            </div>
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
                                                plan === Plan.BUSINESS ||
                                                loadingUpdate ||
                                                loading
                                            }
                                            loading={
                                                plan === Plan.BUSINESS &&
                                                loadingUpdate
                                            }
                                            onClick={() => {
                                                hasCard
                                                    ? changePaymentPlan(
                                                          Plan.BUSINESS
                                                      )
                                                    : setChosenPlan(
                                                          Plan.BUSINESS
                                                      )
                                            }}
                                        >
                                            {plan === Plan.BUSINESS
                                                ? 'Current plan'
                                                : 'Choose plan'}
                                        </LoadingButton>
                                    </Paper>
                                </Grid>
                            </Grid>

                            <PaymentDialog
                                title="Enter your credit card details"
                                open={!!chosenPlan}
                                canClose
                                onConfirm={() => {
                                    changePaymentPlan(Plan.SMALL)
                                    setChosenPlan(undefined)
                                }}
                                onClose={() => setChosenPlan(undefined)}
                            />
                        </PaddingWrapper>
                    </PaddingWrapper>

                    <ConfirmDialog
                        title="Are you sure you want to change plan?"
                        onClose={() => setConfirmDialogOpen(false)}
                        onConfirm={() => {
                            setConfirmDialogOpen(false)
                            changePaymentPlan(Plan.METERED)
                        }}
                        open={confirmDialogOpen}
                    >
                        You will still be charged for this month.
                    </ConfirmDialog>
                </>
            </Elements>
        </StripeProvider>
    )
}

export default PaymentPlanTab
