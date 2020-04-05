import sendgrid from '@sendgrid/mail'
import Logger from 'utils/logging/logger'
import { EmailOptions } from './typedefs'

// Sendgrid templates
export enum Template {
    VERIFY_EMAIL = 'd-573ebca991ce4ff2879a95e37e01b7e3',
    FORGOT_PASSWORD = 'd-92a0764b3cca43529b388fd8f855bd94',
    JOB_HAS_ERRORS = 'd-87eb5df167844c8d9630891eadfee57c',
    PAYMENT_FAILED = 'd-16e03b7c501346fd909945d39aa6cd98',
    TRIAL_WILL_END = 'd-b6b390e3f8734e71a6f22bd14694caf7',
    OUT_OF_FREE_CREDITS = 'd-a8633372461a4c11aa11f595bf0ae15c'
}

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!)

export const SUPPORT_EMAIL_ADDRESS = 'help@bitpull.io'

export const Senders = {
    Bitpull: { email: SUPPORT_EMAIL_ADDRESS, name: 'Bitpull' }
}

export const send = (options: EmailOptions) => {
    if (process.env.NODE_ENV === 'test') {
        return
    }

    const message = {
        to: options.to,
        from: options.from || Senders.Bitpull,
        templateId: options.template,
        dynamic_template_data: options.params!,
        hideWarnings: true
    }

    // @ts-ignore
    return sendgrid.send(message).catch((error: Error) => {
        Logger.error(new Error('Error sending email'), error)
    })
}

const Email = {
    send
}

export default Email
