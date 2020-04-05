import assert from 'assert'
import { NodeParser } from '../../../typedefs/node'
import { sendMail } from '../../../utils/email'
import { EmailNode } from './typedefs'
import { getMessage } from './helper'
import { EmailError } from './errors'

const email: NodeParser<EmailNode> = async (input, options) => {
    const { settings, onLog } = options
    const { node } = input

    assert(settings.email?.to, EmailError.TO_ADDRESS_MISSING)

    const message = getMessage(input)

    await sendMail(
        {
            to: settings.email?.to!,
            params: {
                message,
                metaData: settings.metaData
            }
        },
        settings
    )

    if (onLog) onLog(node, `Sent email to ${settings.email?.to}`)

    return input
}

export default email
