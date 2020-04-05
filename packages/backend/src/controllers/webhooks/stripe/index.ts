import { RequestHandler } from 'express'
import Stripe from 'components/stripe'
import Logger from 'utils/logging/logger'
import PaymentService from 'services/payment'
import MailService from 'services/mail'
import { WebhookEvent } from './typedefs'

const handler: RequestHandler = async (req, res) => {
    const signature = req.headers['stripe-signature'] as string

    try {
        const event = Stripe.getWebhookEvent(req.body, signature)

        Logger.info(`Received Stripe webhook of type ${event.type}`)

        // Handle the event
        switch (event.type) {
            case WebhookEvent.SUBSCRIPTION_DELETED:
                // payment failed a couple of times, change plan of user and close down jobs etc
                // downgradePlan(event.data);
                break
            case WebhookEvent.PAYMENT_FAILED:
                await PaymentService.disable(
                    (event.data.object as any).customer
                )
                break
            case WebhookEvent.PAYMENT_SUCCEEDED:
                // update billingPeriodEndsAt in user
                // send email to user that payment succeedeed
                break
            case WebhookEvent.TRIAL_WILL_END:
                await MailService.sendTrialWillEndEmail(
                    (event.data.object as any).customer
                )
                break
            default:
                return res.status(200).end()
        }

        // Return a response to acknowledge receipt of the event
        res.json({ received: true })
    } catch (error) {
        Logger.error(error)
        return res.status(400).send(`Webhook Error: ${error.message}`)
    }
}

export default handler
