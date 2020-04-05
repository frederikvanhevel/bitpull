import React from 'react'
import {
    Grid,
    Typography,
    Divider,
    Theme,
    makeStyles,
    Paper
} from '@material-ui/core'
import PaddingWrapper from 'components/navigation/PaddingWrapper'
import CardSection from './payment/CardSection'
import InvoiceSection from './payment/InvoiceSection'
import UsageSection from './payment/UsageSection'

const useStyles = makeStyles((theme: Theme) => ({
    divider: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6)
    }
}))

const PaymentTab: React.FC = () => {
    const classes = useStyles()

    return (
        <PaddingWrapper>
            <Paper>
                <PaddingWrapper>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <Typography variant="h6">Card</Typography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={5} xl={4}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <CardSection />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider className={classes.divider} />

                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <Typography variant="h6">Usage</Typography>
                        </Grid>
                        <Grid item xs={8} md={8} lg={5} xl={4}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <UsageSection />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider className={classes.divider} />

                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <Typography variant="h6">Invoices</Typography>
                        </Grid>
                        <Grid item xs={8} md={8} lg={5} xl={4}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <InvoiceSection />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </PaddingWrapper>
            </Paper>
        </PaddingWrapper>
    )
}

export default PaymentTab
