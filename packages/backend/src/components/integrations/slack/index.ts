import IntegrationModel from 'models/integration'
import Axios from 'axios'
import QueryString from 'qs'
import { AuthenticationContext } from 'controllers/graphql/directives/auth'
import { NotFoundError } from 'utils/errors'
import { IntegrationType } from '@bitpull/worker'
import Logger from 'utils/logging/logger'
import Config from 'utils/config'
import { AuthorizationHandler, AuthroizationCode } from '../typedefs'
import { SlackChannel } from './typedefs'

const authorize: AuthorizationHandler = async (
    context: AuthenticationContext,
    data: AuthroizationCode
) => {
    const requestBody = {
        client_id: Config.SLACK_CLIENT_ID,
        client_secret: Config.SLACK_CLIENT_SECRET,
        redirect_uri: `${Config.APP_URL}/integrations/slack`,
        code: data.code
    }

    let result
    try {
        result = await Axios({
            method: 'post',
            url: 'https://slack.com/api/oauth.access',
            data: QueryString.stringify(requestBody),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    } catch (error) {
        const related = new Error(JSON.stringify(error.response.data))
        Logger.throw(new Error('Could not authorize with Slack'), related)
    }

    if (!result.data.ok) {
        throw new Error('Slack autorization failed')
    }

    try {
        const integration = await IntegrationModel.findOneAndUpdate(
            { type: IntegrationType.SLACK, owner: context.user.id },
            {
                active: true,
                settings: result.data
            },
            { upsert: true, new: true }
        )

        await integration.save()
    } catch (error) {
        Logger.error(new Error('Could not authorize slack'), error)
        throw error
    }
}

export const getChannels = async (context: AuthenticationContext) => {
    const slackIntegration = await IntegrationModel.findOne({
        type: IntegrationType.SLACK,
        active: true,
        owner: context.user.id
    }).lean()

    if (!slackIntegration || !slackIntegration.settings.access_token) {
        return new NotFoundError()
    }

    let result
    try {
        result = await Axios({
            method: 'get',
            url: 'https://slack.com/api/channels.list',
            headers: {
                Authorization: `Bearer ${slackIntegration.settings.access_token}`
            }
        })
    } catch (error) {
        const related = new Error(JSON.stringify(error.response.data))
        Logger.throw(new Error('Could not get Slack channels'), related)
    }

    try {
        return result.data.channels.map((channel: SlackChannel) => ({
            id: channel.id,
            name: channel.name
        }))
    } catch (error) {
        Logger.error(new Error('Could not get Slack channels'), error)
        throw error
    }
}

const Slack = {
    authorize,
    getChannels
}

export default Slack
