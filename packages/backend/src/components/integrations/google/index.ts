import Axios from 'axios'
import QueryString from 'qs'
import IntegrationModel, { Integration } from 'models/integration'
import { AuthenticationContext } from 'controllers/graphql/directives/auth'
import { IntegrationType } from '@bitpull/worker'
import { NotFoundError } from 'utils/errors'
import { AuthorizationHandler } from '../typedefs'
import { GoogleProfile } from './typedefs'

const authorize: AuthorizationHandler = async (
    context: AuthenticationContext,
    data: any
) => {
    const requestBody = {
        code: data.code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        scope: 'https://www.googleapis.com/auth/drive.file',
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.APP_URL}/integrations/google-drive`
    }

    let result
    try {
        result = await Axios({
            method: 'POST',
            url: 'https://www.googleapis.com/oauth2/v4/token',
            data: QueryString.stringify(requestBody),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    } catch (error) {
        throw new Error(JSON.stringify(error.response.data))
    }

    const integration = await IntegrationModel.findOneAndUpdate(
        { type: IntegrationType.GOOGLE_DRIVE, owner: context.user.id },
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
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: integration.settings.refresh_token
    }

    let result
    try {
        result = await Axios({
            method: 'POST',
            url: 'https://www.googleapis.com/oauth2/v4/token',
            data: QueryString.stringify(requestBody),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    } catch (error) {
        throw new Error(JSON.stringify(error.response.data))
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

const getProfile = async (code: string): Promise<GoogleProfile> => {
    try {
        const data = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: `${process.env.APP_URL}/auth/callback/google`
        }

        const token = await Axios({
            method: 'POST',
            url: 'https://www.googleapis.com/oauth2/v4/token',
            data: QueryString.stringify(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        const result = await Axios({
            method: 'GET',
            url: `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token.data.access_token}`
        })

        return result.data
    } catch (error) {
        throw new Error(JSON.stringify(error.response.data))
    }
}

const GoogleDrive = {
    authorize,
    refreshToken,
    getProfile
}

export default GoogleDrive
