import PaymentModel, { PaymentPlan } from 'models/payment'
import Stripe from 'components/stripe'
import Database from 'components/data/mongodb'
import Logger from 'utils/logging/logger'

export async function up() {
    try {
        await Database.connect()

        const payments = await PaymentModel.find({})

        for (const payment of payments) {
            if (!payment.customerId) continue

            Logger.info(`Migrating payment for ${payment.owner}`)

            // @ts-ignore
            if (payment.subscriptionId) {
                try {
                    // @ts-ignore
                    await Stripe.removeSubscription(payment.subscriptionId)
                } catch (error) {}
            }

            try {
                const {
                    subscriptionId,
                    planId
                } = await Stripe.createSubscription(
                    payment.customerId,
                    PaymentPlan.FREE
                )

                payment.planId = planId
                payment.subscriptionId = subscriptionId
                payment.plan = PaymentPlan.FREE

                await payment.save()
            } catch (error) {
                Logger.error(
                    new Error(
                        `Could not create subscription for user ${payment.owner}`
                    ),
                    error
                )
            }
        }

        try {
            await PaymentModel.collection.updateMany(
                {},
                {
                    $unset: {
                        recurringPlanId: 1,
                        meteredPlanId: 1,
                        disabled: 1
                    }
                }
            )
        } catch (error) {
            Logger.error(new Error(`Could not unset fields`), error)
        }
    } finally {
        await Database.disconnect()
    }
}

export async function down() {}
