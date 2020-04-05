import React, { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import Payment from './Payment'
import {
    Dialog,
    DialogTitle,
    Divider,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    makeStyles
} from '@material-ui/core'
import LockIcon from '@material-ui/icons/Lock'
import CreditCardIcon from '@material-ui/icons/CreditCard'
import { ReactStripeElements, injectStripe } from 'react-stripe-elements'
import { useMutation } from '@apollo/react-hooks'
import { TokenInput } from 'typedefs/graphql'
import { UPDATE_PAYMENT } from 'mutations/payment'
import { updatePayment } from 'mutations/payment/typedefs/updatePayment'
import LoadingButton from 'components/ui/buttons/LoadingButton'

type Props = {
    title: string
    open?: boolean
    canClose?: boolean
    onConfirm: (token: stripe.Token) => void
    onClose: () => void
} & ReactStripeElements.InjectedStripeProps

const useStyles = makeStyles(theme => ({
    dialog: {
        width: 600
    },
    info: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: theme.spacing(2),
        '& svg': {
            fontSize: '16px',
            marginRight: theme.spacing(1) / 2,
            fill: theme.palette.secondary.main
        }
    },
    actions: {
        justifyContent: 'space-between'
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        '& > svg': {
            marginRight: theme.spacing(1)
        }
    },
    content: {
        overflowY: 'hidden'
    },
    cancel: {
        marginRight: theme.spacing(1)
    }
}))

const mapTokenVariables = (token: stripe.Token): TokenInput => {
    return {
        token: {
            id: token.id,
            object: token.object,
            created: token.created,
            livemode: token.livemode,
            type: token.type,
            used: token.used,
            card: {
                object: token.card!.object,
                brand: token.card!.brand,
                exp_month: token.card!.exp_month,
                exp_year: token.card!.exp_year,
                last4: token.card!.last4
            }
        }
    }
}

const PaymentDialog: React.FC<Props> = ({
    title,
    open,
    canClose,
    onConfirm,
    onClose,
    stripe
}) => {
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const [loadingStarted, setLoading] = useState(false)
    const [updateCardDetails, { loading, error }] = useMutation<updatePayment>(
        UPDATE_PAYMENT,
        {
            onError: () => {
                enqueueSnackbar('Could not update credit card', {
                    variant: 'error'
                })
            }
        }
    )

    const confirmPayment = async () => {
        if (!stripe) return
        setLoading(true)
        const { error: stripeError, token } = await stripe.createToken()

        if (stripeError || !token) {
            setLoading(false)
            return
        }

        await updateCardDetails({
            variables: {
                input: mapTokenVariables(token)
            }
        })

        onConfirm(token)
        setLoading(false)

        enqueueSnackbar('Card information updated', {
            variant: 'success'
        })
    }

    useEffect(() => {
        if (error) setLoading(false)
    }, [error])

    return (
        <Dialog
            open={open || false}
            onClose={onClose}
            classes={{ paper: classes.dialog }}
        >
            <DialogTitle>
                <div className={classes.title}>
                    <CreditCardIcon /> {title}
                </div>
            </DialogTitle>
            <Divider />
            <DialogContent classes={{ root: classes.content }}>
                <Payment />
            </DialogContent>
            <Divider />
            <DialogActions classes={{ root: classes.actions }}>
                <Typography variant="caption" className={classes.info}>
                    <LockIcon /> Payments secured with Stripe
                </Typography>

                <div>
                    {canClose && (
                        <Button
                            onClick={onClose}
                            color="default"
                            className={classes.cancel}
                        >
                            Cancel
                        </Button>
                    )}
                    <LoadingButton
                        onClick={confirmPayment}
                        color="primary"
                        variant="contained"
                        autoFocus
                        disabled={loadingStarted || loading}
                        loading={loadingStarted || loading}
                    >
                        Confirm
                    </LoadingButton>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default injectStripe(PaymentDialog)
