import Axios from 'axios'
import QueryString = require('qs')
import IntegrationModel from 'models/integration'
import { AuthenticationContext } from 'controllers/graphql/directives/auth'
import { IntegrationType } from '@bitpull/worker'
import Logger from 'utils/logging/logger'
import { AuthorizationHandler, AuthroizationCode } from '../typedefs'

const authorize: AuthorizationHandler = async (
    context: AuthenticationContext,
    data: AuthroizationCode
) => {
    const requestBody = {
        client_id: process.env.DROPBOX_CLIENT_ID,
        client_secret: process.env.DROPBOX_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.APP_URL}/integrations/dropbox`,
        code: data.code
    }

    let result
    try {
        result = await Axios({
            method: 'POST',
            url: 'https://api.dropboxapi.com/oauth2/token',
            data: QueryString.stringify(requestBody),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    } catch (error) {
        const related = new Error(JSON.stringify(error.response.data))
        Logger.throw(new Error('Could not authorize with Google'), related)
    }

    try {
        const integration = await IntegrationModel.findOneAndUpdate(
            { type: IntegrationType.DROPBOX, owner: context.user.id },
            {
                active: true,
                settings: result.data
            },
            { upsert: true, new: true }
        )

        await integration.save()
    } catch (error) {
        Logger.error(new Error('Dropbox autorization failed'), error)
        throw error
    }
}

const Dropbox = {
    authorize
}

export default Dropbox
