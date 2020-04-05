import crypto from 'crypto'
import { RequestHandler } from 'express'

// this code is adapted from https://docs.growsurf.com/automate-rewards/webhooks/examples
export const checkSignature: RequestHandler = async req => {
    const signature = req.header('growsurf-signature')

    // Extract
    const parts = signature!.split(',')
    // t value
    const timestamp = parts[0].split('=')[1]
    // v value
    const hash = parts[1].split('=')[1]
    // Generate hash
    const message = timestamp + '.' + JSON.stringify(req.body)
    const hmac = crypto.createHmac(
        'sha256',
        process.env.GROWSURF_WEBHOOK_SECRET!
    )

    hmac.update(message)

    // Validate/Compare
    if (hmac.digest('hex') !== hash) {
        throw new Error('Invalid Webhook Signature')
    }
}
