import IntegrationModel from 'models/integration'
import Axios from 'axios'
import QueryString from 'qs'
import { AuthenticationContext } from 'controllers/graphql/directives/auth'
import { IntegrationType } from '@bitpull/worker'
import Logger from 'utils/logging/logger'
import { NotFoundError } from 'utils/errors'
import { AuthorizationHandler, AuthroizationCode } from '../typedefs'
import { GithubRepository } from './typedefs'

const authorize: AuthorizationHandler = async (
    context: AuthenticationContext,
    data: AuthroizationCode
) => {
    const requestBody = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        redirect_uri: `${process.env.APP_URL}/integrations/github`,
        code: data.code
    }

    let result
    try {
        result = await Axios({
            method: 'post',
            url: 'https://github.com/login/oauth/access_token',
            data: QueryString.stringify(requestBody),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            }
        })
    } catch (error) {
        const related = new Error(JSON.stringify(error.response.data))
        Logger.throw(new Error('Could not authorize with Github'), related)
    }

    try {
        const integration = await IntegrationModel.findOneAndUpdate(
            // @ts-ignore
            { type: 'GITHUB', owner: context.user.id },
            {
                active: true,
                settings: result.data
            },
            { upsert: true, new: true }
        )

        await integration.save()
    } catch (error) {
        Logger.error(new Error('Could not authorize Github'), error)
        throw error
    }
}

const getRepositories = async (context: AuthenticationContext) => {
    const githubIntegration = await IntegrationModel.findOne({
        type: IntegrationType.GITHUB,
        active: true,
        owner: context.user.id
    }).lean()

    if (!githubIntegration || !githubIntegration.settings.access_token) {
        return new NotFoundError()
    }

    let result
    try {
        result = await Axios({
            method: 'get',
            url: 'https://api.github.com/user/repos',
            headers: {
                Authorization: `Bearer ${githubIntegration.settings.access_token}`
            }
        })
    } catch (error) {
        const related = new Error(JSON.stringify(error.response.data))
        Logger.throw(new Error('Could not get Github repositories'), related)
    }

    try {
        return result.data.map((repo: GithubRepository) => ({
            name: repo.name,
            owner: repo.owner.login
        }))
    } catch (error) {
        Logger.error(new Error('Could not get Github repositories'), error)
        throw error
    }
}

const Github = {
    authorize,
    getRepositories
}

export default Github
