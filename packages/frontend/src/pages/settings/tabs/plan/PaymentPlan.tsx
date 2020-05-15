import React from 'react'
import {
    Grid,
    Typography,
    makeStyles,
    Theme,
    Divider,
    Paper
} from '@material-ui/core'
import cx from 'classnames'
import { Plan } from 'typedefs/graphql'
import { CheckCircle, RemoveCircle } from '@material-ui/icons'
import LoadingButton from 'components/ui/buttons/LoadingButton'

export type PlanDescription = {
    popular?: boolean
    title: string
    price: number
    quantity: string
    pages?: number
    features: string[]
    missingFeatures: string[]
}

type Props = {
    plan: Plan
    currentPlan: Plan
    description: PlanDescription
    loading: boolean
    onChoose: (plan: Plan) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
        padding: theme.spacing(5, 3),
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
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
    pages: {
        marginRight: 4
    }
}))

const PaymentPlan: React.FC<Props> = ({
    plan,
    currentPlan,
    description,
    loading,
    onChoose
}) => {
    const classes = useStyles()

    return (
        <Grid item xs={5} md={5} lg={4} xl={3}>
            <Paper
                className={cx(classes.wrapper, {
                    [classes.selected]: currentPlan === plan
                })}
                elevation={2}
            >
                {description.popular && (
                    <Typography className={classes.popular} variant="caption">
                        Popular option
                    </Typography>
                )}
                <Typography variant="subtitle1" className={classes.top}>
                    {description.title}
                </Typography>
                <Typography variant="h3" className={classes.price}>
                    <span className={classes.currency}>$</span>
                    {description.price}
                </Typography>
                <Typography variant="subtitle1" className={classes.bottom}>
                    {description.quantity}
                </Typography>

                <Divider className={classes.divider} />

                <div className={classes.list}>
                    <div className={classes.check}>
                        <CheckCircle
                            className={cx(classes.icon, classes.success)}
                        />
                        {description.pages ? (
                            <>
                                <strong className={classes.pages}>
                                    {description.pages}
                                </strong>{' '}
                                pages per month
                            </>
                        ) : (
                            'Unlimited pages'
                        )}
                    </div>

                    {description.features.map(feature => (
                        <div className={classes.check}>
                            <CheckCircle
                                className={cx(classes.icon, classes.success)}
                            />
                            {feature}
                        </div>
                    ))}
                    {description.missingFeatures.map(feature => (
                        <div className={classes.check}>
                            <RemoveCircle
                                className={cx(classes.icon, classes.error)}
                            />
                            {feature}
                        </div>
                    ))}
                </div>

                <LoadingButton
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    disabled={currentPlan === plan || loading}
                    loading={loading}
                    onClick={() => onChoose(plan)}
                >
                    {currentPlan === plan ? 'Current plan' : 'Choose plan'}
                </LoadingButton>
            </Paper>
        </Grid>
    )
}

export default PaymentPlan
