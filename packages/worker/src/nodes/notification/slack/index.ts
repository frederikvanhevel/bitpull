import request from 'request-promise-native'
import { NodeParser } from '../../../typedefs/node'
import { assert } from '../../../utils/common'
import { IntegrationType, LogType } from '../../../typedefs/common'
import { IntegrationError, NodeError } from '../../common/errors'
import { SlackNode } from './typedefs'
import { SlackError } from './errors'

import { getMessage } from './helper'

const SLACK_METHOD_URL = 'https://slack.com/api/chat.postMessage'

const slack: NodeParser<SlackNode> = async (input, options) => {
    const { integrations = [], onLog } = options
    const { node } = input

    const slackIntegration = integrations.find(
        integration => integration.type === IntegrationType.SLACK
    )

    assert(slackIntegration, IntegrationError.INTEGRATION_MISSING)
    assert(slackIntegration.active, IntegrationError.INTEGRATION_INACTIVE)
    assert(
        slackIntegration.settings.access_token,
        IntegrationError.ACCESS_TOKEN_MISSING
    )
    assert(node.channel, SlackError.CHANNEL_MISSING)
    assert(
        !node.children || !node.children.length,
        NodeError.NO_CHILDREN_ALLOWED
    )

    const result = await request({
        uri: SLACK_METHOD_URL,
        method: 'POST',
        body: {
            channel: node.channel,
            ...getMessage(input, options)
        },
        json: true,
        headers: {
            Authorization: `Bearer ${slackIntegration.settings.access_token}`,
            'Content-Type': 'application/json; charset=utf-8'
        }
    })

    if (!result.ok) {
        if (onLog) onLog(node, 'Unable to send slack message', LogType.WARN)
    }

    if (onLog) onLog(node, `Sent slack message to channel #${node.channel}`)

    return input
}

export default slack
