import React from 'react'
import { Grid } from '@material-ui/core'
import {
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement
} from 'react-stripe-elements'
import StripeElementWrapper from './StripeElementWrapper'

const Payment: React.FC = () => {
    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <StripeElementWrapper
                    label="Card Number"
                    placeholder="4242 4242 4242 4242"
                    component={CardNumberElement}
                    // onChange={this.onChangeInput}
                />
            </Grid>
            <Grid item xs={7}>
                <StripeElementWrapper
                    label="Expiry (MM / YY)"
                    component={CardExpiryElement}
                />
            </Grid>
            <Grid item xs={5}>
                <StripeElementWrapper label="CVC" component={CardCVCElement} />
            </Grid>
            <Grid item xs={12} />
        </Grid>
    )
}

export default Payment
