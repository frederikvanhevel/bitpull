import stripe from 'stripe'
import getUnixTime from 'date-fns/getUnixTime'
import fromUnixTime from 'date-fns/fromUnixTime'
import { startOfMonth } from 'date-fns'
import { PaymentPlan, Payment } from 'models/payment'
import {
    StripePaymentPlan,
    StripeSubscription,
    Invoice,
    UsageSummary
} from './typedefs'

const PAYMENT_PLAN_MAP: Record<PaymentPlan, StripePaymentPlan> = {
    [PaymentPlan.METERED]: StripePaymentPlan.METERED,
    [PaymentPlan.MONTHLY]: StripePaymentPlan.MONTHLY
}
const stripeHandler = new stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2020-03-02'
})

const createCustomer = async (
    email: string,
    name: string,
    plan: PaymentPlan,
    cardToken?: string
): Promise<StripeSubscription> => {
    const customer = await stripeHandler.customers.create({
        email,
        name,
        source: cardToken
    })

    const subscription = await stripeHandler.subscriptions.create({
        customer: customer.id,
        items: [{ plan: StripePaymentPlan.METERED }]
    })

    return {
        customerId: customer.id,
        subscriptionId: subscription.id,
        meteredPlanId: subscription.items.data[0].id,
        trialEndsAt: subscription.trial_end
            ? fromUnixTime(subscription.trial_end)
            : undefined
    }
}

const updateCustomer = async (
    customerId: string,
    data: stripe.CustomerUpdateParams
) => {
    return await stripeHandler.customers.update(customerId, data)
}

const changePlan = async (payment: Payment, plan: PaymentPlan) => {
    if (plan !== PaymentPlan.METERED) {
        // new recurring plan
        const result = await stripeHandler.subscriptionItems.create({
            subscription: payment.subscriptionId,
            plan: PAYMENT_PLAN_MAP[plan]
        })

        return result.id
    }

    // remove recurring plan
    await stripeHandler.subscriptions.update(payment.subscriptionId, {
        items: [
            {
                id: payment.recurringPlanId,
                deleted: true
            }
        ]
    })
}

const setCardToken = async (customerId: string, cardToken: string) => {
    await stripeHandler.customers.update(customerId, {
        source: cardToken
    })
}

const reportUsage = async (
    meteredPlanId: string,
    quantity: number,
    idempotencyKey?: string
) => {
    stripeHandler.subscriptionItems.createUsageRecord(
        meteredPlanId,
        {
            quantity,
            timestamp: getUnixTime(new Date()),
            action: 'increment'
        },
        {
            idempotencyKey
        }
    )
}

const getWebhookEvent = (body: any, signature: string) => {
    return stripeHandler.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
    )
}

const getInvoices = async (
    customerId: string,
    limit: number = 10
): Promise<Invoice[]> => {
    const invoices: stripe.Invoice[] = await stripeHandler.invoices
        .list({ customer: customerId })
        .autoPagingToArray({ limit })

    return invoices
        .filter(item => item.total > 0 && item.status !== 'draft')
        .map(item => ({
            amount: item.total / 100, // amount is initially in cents
            currency: item.currency,
            date: fromUnixTime(item.period_end),
            status: item.status,
            url: item.invoice_pdf,
            description: item.description
        }))
}

const getUsageSummary = async (
    meteredPlanId: string
): Promise<UsageSummary | undefined> => {
    const summary = await stripeHandler.subscriptionItems.listUsageRecordSummaries(
        meteredPlanId,
        { limit: 1 }
    )

    if (!summary.data.length) return undefined

    const { total_usage, period } = summary.data[0]

    return {
        total: total_usage,
        start: period.start
            ? fromUnixTime(period.start)
            : startOfMonth(new Date()),
        end: period.end ? fromUnixTime(period.end) : undefined
    }
}

const Stripe = {
    createCustomer,
    updateCustomer,
    changePlan,
    setCardToken,
    reportUsage,
    getWebhookEvent,
    getInvoices,
    getUsageSummary
}

export default Stripe
