import assert from 'assert'
import sendgrid from '@sendgrid/mail'
import { Settings } from '../../typedefs/common'
import { EmailOptions } from './typedefs'

export const SUPPORT_EMAIL_ADDRESS = 'help@bitpull.io'

export const Senders = {
    Bitpull: { email: SUPPORT_EMAIL_ADDRESS, name: 'Bitpull' }
}

export const sendMail = (options: EmailOptions, settings: Settings) => {
    if (process.env.NODE_ENV === 'test') {
        return
    }

    assert(settings.email?.apiKey, 'Email api not set up correctly')
    assert(settings.email?.template, 'Email template not set up correctly')

    sendgrid.setApiKey(settings.email?.apiKey!)

    const message = {
        to: options.to,
        from: options.from || Senders.Bitpull,
        templateId: settings.email?.template!,
        dynamic_template_data: options.params!
    }

    return sendgrid.send(message).catch(() => {
        throw new Error('Error sending email')
    })
}
