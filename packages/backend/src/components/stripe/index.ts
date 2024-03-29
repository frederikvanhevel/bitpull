import stripe from 'stripe'
import getUnixTime from 'date-fns/getUnixTime'
import fromUnixTime from 'date-fns/fromUnixTime'
import { startOfMonth } from 'date-fns'
import { PaymentPlan, Payment } from 'models/payment'
import Logger from 'utils/logging/logger'
import Config from 'utils/config'
import { StripePaymentPlan, Invoice, UsageSummary } from './typedefs'

const PAYMENT_PLAN_MAP: Record<PaymentPlan, StripePaymentPlan> = {
    [PaymentPlan.FREE]: StripePaymentPlan.FREE,
    [PaymentPlan.METERED]: StripePaymentPlan.METERED,
    [PaymentPlan.SMALL]: StripePaymentPlan.SMALL,
    [PaymentPlan.BUSINESS]: StripePaymentPlan.BUSINESS,
    [PaymentPlan.PREMIUM]: StripePaymentPlan.PREMIUM
}
const stripeHandler = new stripe(Config.STRIPE_SECRET_KEY, {
    apiVersion: '2020-03-02'
})

const createCustomer = async (email: string, name: string) => {
    try {
        const customer = await stripeHandler.customers.create({
            email,
            name
        })

        return customer.id
    } catch (error) {
        Logger.throw(new Error('Could not create customer in stripe'), error)
    }
}

const createSubscription = async (customerId: string, plan: PaymentPlan) => {
    try {
        const subscription = await stripeHandler.subscriptions.create({
            customer: customerId,
            items: [
                {
                    plan: PAYMENT_PLAN_MAP[plan]
                }
            ]
        })

        return {
            subscriptionId: subscription.id,
            planId: subscription.items.data[0].id
        }
    } catch (error) {
        Logger.throw(
            new Error('Could not create subscription in stripe'),
            error
        )
    }
}

const removeSubscription = async (subscriptionId: string) => {
    try {
        await stripeHandler.subscriptions.del(subscriptionId)
    } catch (error) {
        Logger.throw(
            new Error('Could not remove subscription in stripe'),
            error
        )
    }
}

const updateCustomer = async (
    customerId: string,
    data: stripe.CustomerUpdateParams
) => {
    try {
        return await stripeHandler.customers.update(customerId, data)
    } catch (error) {
        Logger.throw(new Error('Could not update customer in stripe'), error)
    }
}

const changePlan = async (payment: Payment, plan: PaymentPlan) => {
    try {
        await stripeHandler.subscriptionItems.update(payment.planId, {
            plan: PAYMENT_PLAN_MAP[plan],
            proration_behavior: 'always_invoice'
        })
    } catch (error) {
        Logger.throw(new Error('Could not change plan in stripe'), error)
    }
}

const setCardToken = async (customerId: string, cardToken: string) => {
    try {
        await stripeHandler.customers.update(customerId, {
            source: cardToken
        })
    } catch (error) {
        Logger.throw(new Error('Could not set card token in stripe'), error)
    }
}

const reportUsage = async (
    meteredPlanId: string,
    quantity: number,
    idempotencyKey?: string
) => {
    try {
        await stripeHandler.subscriptionItems.createUsageRecord(
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
    } catch (error) {
        Logger.error(new Error('Could not report usage in stripe'), error)
    }
}

const getWebhookEvent = (body: any, signature: string) => {
    return stripeHandler.webhooks.constructEvent(
        body,
        signature,
        Config.STRIPE_WEBHOOK_SECRET
    )
}

const getInvoices = async (
    customerId: string,
    limit: number = 10
): Promise<Invoice[]> => {
    try {
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
    } catch (error) {
        Logger.throw(new Error('Could not get invoices in stripe'), error)
    }
}

const getUsageSummary = async (
    meteredPlanId: string
): Promise<UsageSummary | undefined> => {
    try {
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
    } catch (error) {
        Logger.throw(new Error('Could not get usage summary in stripe'), error)
    }
}

const Stripe = {
    createCustomer,
    createSubscription,
    removeSubscription,
    updateCustomer,
    changePlan,
    setCardToken,
    reportUsage,
    getWebhookEvent,
    getInvoices,
    getUsageSummary
}

export default Stripe
