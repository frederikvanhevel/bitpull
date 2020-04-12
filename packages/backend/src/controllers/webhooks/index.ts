import { Router } from 'express'
import bodyParser from 'body-parser'
import stripeWebhookHandler from './stripe'

const webhookRouter = Router()

webhookRouter.post(
    '/stripe',
    bodyParser.raw({ type: 'application/json' }),
    stripeWebhookHandler
)

export default webhookRouter
