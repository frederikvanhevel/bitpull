import IntegrationModel, { Integration } from 'models/integration'
import Axios from 'axios'
import QueryString from 'qs'
import { AuthenticationContext } from 'controllers/graphql/directives/auth'
import { IntegrationType } from '@bitpull/worker'
import { NotFoundError } from 'utils/errors'
import Logger from 'utils/logging/logger'
import { AuthorizationHandler } from '../typedefs'

const authorize: AuthorizationHandler = async (
    context: AuthenticationContext,
    data: any
) => {
    const requestBody = {
        client_id: process.env.ONEDRIVE_CLIENT_ID,
        client_secret: process.env.ONEDRIVE_CLIENT_SECRET,
        scope: 'Files.ReadWrite offline_access',
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.APP_URL}/integrations/onedrive`,
        code: data.code
    }

    let result
    try {
        result = await Axios({
            method: 'POST',
            url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            data: QueryString.stringify(requestBody),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    } catch (error) {
        const related = new Error(JSON.stringify(error.response.data))
        Logger.throw(new Error('Could not authorize with OneDrive'), related)
    }

    const integration = await IntegrationModel.findOneAndUpdate(
        { type: IntegrationType.ONEDRIVE, owner: context.user.id },
        {
            active: true,
            settings: result.data
        },
        { upsert: true, new: true }
    )

    await integration.save()
}

const refreshToken = async (integration: Integration): Promise<Integration> => {
    const requestBody = {
        client_id: process.env.ONEDRIVE_CLIENT_ID,
        client_secret: process.env.ONEDRIVE_CLIENT_SECRET,
        scope: 'Files.ReadWrite offline_access',
        grant_type: 'refresh_token',
        refresh_token: integration.settings.refresh_token
    }

    let result
    try {
        result = await Axios({
            method: 'POST',
            url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            data: QueryString.stringify(requestBody),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    } catch (error) {
        const related = new Error(JSON.stringify(error.response.data))
        Logger.throw(
            new Error('Could not refresh token with OneDrive'),
            related
        )
    }

    const updated = await IntegrationModel.findByIdAndUpdate(
        integration._id,
        {
            settings: {
                ...integration.settings,
                ...result.data
            }
        },
        { new: true }
    )

    if (!updated) {
        throw new NotFoundError()
    }

    return updated
}

const OneDrive = {
    authorize,
    refreshToken
}

export default OneDrive
