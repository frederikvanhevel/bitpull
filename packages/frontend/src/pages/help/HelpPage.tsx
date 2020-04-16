import React from 'react'
import { makeStyles, Paper, Typography, Grid } from '@material-ui/core'
import PageTitle from 'components/navigation/PageTitle'
import PaddingWrapper from 'components/navigation/PaddingWrapper'
import Toolbar from 'components/navigation/Toolbar'
import { useMutation } from '@apollo/react-hooks'
import { SEND_FEEDBACK } from 'mutations/utility'
import {
    feedback,
    feedbackVariables
} from 'mutations/utility/typedefs/feedback'
import FeedbackForm, { Feedback } from './Form'

const useStyles = makeStyles(theme => ({
    success: {
        color: theme.palette.success.main
    }
}))

const HelpPage: React.FC = () => {
    const classes = useStyles()

    const [send, { data, loading }] = useMutation<feedback, feedbackVariables>(
        SEND_FEEDBACK
    )

    const sent = data?.feedback === true

    const onSubmit = async (form: Feedback) => {
        await send({
            variables: form
        })
    }

    return (
        <>
            <PageTitle>Help - BitPull</PageTitle>

            <Toolbar>
                <Typography variant="body2">
                    Need help or have do you have feedback to make our product
                    better? Contact us!
                </Typography>
            </Toolbar>
            <PaddingWrapper withTopbar>
                <Paper>
                    <PaddingWrapper>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <Typography variant="h6">Contact us</Typography>
                            </Grid>

                            {sent ? (
                                <Grid item xs={6} md={6} lg={5} xl={4}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="body2"
                                                className={classes.success}
                                            >
                                                Thanks for the feedback! We'll
                                                get back to you asap.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ) : (
                                <FeedbackForm
                                    onSubmit={onSubmit}
                                    loading={loading}
                                />
                            )}
                        </Grid>
                    </PaddingWrapper>
                </Paper>
            </PaddingWrapper>
        </>
    )
}

export default HelpPage
