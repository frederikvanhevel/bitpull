import { GraphQLFieldResolver } from 'graphql'
import IntegrationService from 'services/integration'
import { Integration } from 'models/integration'
import Slack from 'components/integrations/slack'
import { IntegrationType } from 'typedefs/graphql'
import { AuthorizationHandler } from 'components/integrations/typedefs'
import Dropbox from 'components/integrations/dropbox'
import Google from 'components/integrations/google'
import OneDrive from 'components/integrations/onedrive'
import Logger from 'utils/logging/logger'
import Github from 'components/integrations/github'
import { AuthenticationContext } from '../directives/auth'

const INTEGRATION_HANDLERS: Record<IntegrationType, AuthorizationHandler> = {
    [IntegrationType.Dropbox]: Dropbox.authorize,
    [IntegrationType.GoogleDrive]: Google.authorize,
    [IntegrationType.Onedrive]: OneDrive.authorize,
    [IntegrationType.Slack]: Slack.authorize,
    [IntegrationType.Github]: Github.authorize
}

export const getActiveIntegrations: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context) => {
    try {
        return await IntegrationService.getActiveIntegrations(context.user)
    } catch (error) {
        Logger.throw(
            new Error('Could not get active integrations'),
            error,
            context.user
        )
    }
}

export const updateIntegration: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    { id: string; data: Partial<Integration> }
> = async (root, args, context): Promise<Integration | null> => {
    try {
        return await IntegrationService.updateIntegration(
            context.user,
            args.id,
            args.data
        )
    } catch (error) {
        Logger.throw(
            new Error('Could not update integration'),
            error,
            context.user
        )
    }
}

export const removeIntegration: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    { id: string }
> = async (root, args, context) => {
    try {
        await IntegrationService.removeIntegration(context.user, args.id)
        return true
    } catch (error) {
        Logger.throw(
            new Error('Could not remove integration'),
            error,
            context.user
        )
    }
}

export const toggleIntegration: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    { id: string; enabled: boolean }
> = async (root, args, context) => {
    try {
        await IntegrationService.toggleIntegration(
            context.user,
            args.id,
            args.enabled
        )
        return true
    } catch (error) {
        Logger.throw(
            new Error('Could not toggle integration'),
            error,
            context.user
        )
    }
}

export const getSlackChannels: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context) => {
    try {
        return await Slack.getChannels(context)
    } catch (error) {
        Logger.throw(
            new Error('Could not get Slack channels'),
            error,
            context.user
        )
    }
}

export const getGithubRepositories: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context) => {
    try {
        return await Github.getRepositories(context)
    } catch (error) {
        Logger.throw(
            new Error('Could not get Github channels'),
            error,
            context.user
        )
    }
}

export const authorize: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    { type: IntegrationType; data: any }
> = async (root, args, context) => {
    try {
        const handler = INTEGRATION_HANDLERS[args.type]
        await handler(context, args.data)
        return true
    } catch (error) {
        Logger.throw(
            new Error(`Could not authorize ${args.type} integration`),
            error,
            context.user
        )
    }
}
