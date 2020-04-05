import { Router } from 'express'
import bodyParser from 'body-parser'
import stripeWebhookHandler from './stripe'
import growsurfWebhookHandler from './growsurf'

const webhookRouter = Router()

webhookRouter.post(
    '/stripe',
    bodyParser.raw({ type: 'application/json' }),
    stripeWebhookHandler
)

webhookRouter.post('/growsurf', growsurfWebhookHandler)

export default webhookRouter
