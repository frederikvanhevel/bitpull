import Logger from 'utils/logging/logger'
import { RequestHandler } from 'express'
import UserModel from 'models/user'
import PaymentService from 'services/payment'
import { RewardWebhook, WebhookEvent } from './typedefs'
import { checkSignature } from './helper'

const handler: RequestHandler = async (req, res, next) => {
    const webhook: RewardWebhook = req.body
    const { participant } = webhook.data

    await checkSignature(req, res, next)

    if (webhook.event !== WebhookEvent.PARTICIPANT_REACHED_A_GOAL) {
        return res.status(200).send('No action')
    }

    const user = await UserModel.findOne({ email: participant.email })

    if (!user) {
        Logger.error(new Error('User not found in Growsurf webhook'))
        return res.status(200)
    }

    await PaymentService.addReferralCredits(user)

    // segment.track(TrackingEvent.REFERRAL_REWARD_TRIGGERED, user, {
    //     properties: eventData
    // })

    return res.status(200).send('Successfully processed')
}

export default handler
