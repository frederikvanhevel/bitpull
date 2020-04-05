import React from 'react'
import { makeStyles, Paper, Typography, Theme, Button } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import PaddingWrapper from 'components/navigation/PaddingWrapper'
import PageTitle from 'components/navigation/PageTitle'
import referralImage from './images/referral.svg'
import { useQuery } from '@apollo/react-hooks'
import { getPaymentDetails } from 'queries/payment/typedefs/getPaymentDetails'
import { GET_PAYMENT_DETAILS } from 'queries/payment'
import { getReferralLink } from 'queries/user/typedefs/getReferralLink'
import { GET_REFERRAL_LINK } from 'queries/user'
import ProgressBar from 'components/ui/ProgressBar'
import Toolbar from 'components/navigation/Toolbar'
import Loader from 'components/ui/Loader'

const TOTAL_POSSIBLE_CREDITS = Number(
    process.env.MAX_REFERRAL_CREDITS! || 20000
)

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: theme.spacing(4)
    },
    image: {
        width: 350,
        height: '100%',
        marginBottom: theme.spacing(4)
    },
    progress: {
        width: '100%'
    },
    credits: {
        marginBottom: theme.spacing(1)
    },
    linkWrapper: {
        width: '100%',
        marginTop: theme.spacing(4)
    },
    link: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing(1),
        background: theme.palette.grey[100],
        border: `1px solid ${theme.palette.grey[200]}`,
        padding: theme.spacing(2),
        borderRadius: 5,
        '& > button': {
            marginLeft: theme.spacing(1)
        }
    }
}))

const ReferralPage: React.FC = () => {
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const { data } = useQuery<getPaymentDetails>(GET_PAYMENT_DETAILS)
    const { data: referralData, loading, error } = useQuery<getReferralLink>(
        GET_REFERRAL_LINK
    )

    const copyToClipboard = async () => {
        if (!referralData?.getReferralLink) return
        await navigator.clipboard.writeText(referralData.getReferralLink)
        enqueueSnackbar('Link has been copied to your clipboard', {
            variant: 'success'
        })
    }

    const earnedCredits = data?.getPaymentDetails.earnedCredits || 0

    return (
        <>
            <PageTitle>Refer a friend - BitPull</PageTitle>

            <Toolbar>
                <Typography variant="body2">
                    Refer a friend and earn bonus credits to run your jobs for
                    free
                </Typography>
            </Toolbar>

            <PaddingWrapper withTopbar>
                <Paper>
                    <div className={classes.wrapper}>
                        <img src={referralImage} className={classes.image} />

                        <div className={classes.progress}>
                            <Typography
                                variant="h5"
                                className={classes.credits}
                            >
                                Your referral bonus:{' '}
                                <strong>{earnedCredits}</strong> seconds
                            </Typography>

                            <ProgressBar
                                percentage={
                                    (earnedCredits / TOTAL_POSSIBLE_CREDITS) *
                                    100
                                }
                            />
                        </div>

                        <div className={classes.linkWrapper}>
                            <Typography variant="subtitle1">
                                Get your friends to sign up with this unique
                                URL:
                            </Typography>

                            {!referralData && error && (
                                <Typography color="error">
                                    Something went wrong
                                </Typography>
                            )}

                            {referralData && !loading ? (
                                <div className={classes.link}>
                                    <Typography>
                                        {referralData?.getReferralLink}
                                    </Typography>
                                    <Button
                                        color="primary"
                                        onClick={() => copyToClipboard()}
                                    >
                                        Copy
                                    </Button>
                                </div>
                            ) : (
                                <Loader hideText />
                            )}
                        </div>
                    </div>
                </Paper>
            </PaddingWrapper>
        </>
    )
}

export default ReferralPage
