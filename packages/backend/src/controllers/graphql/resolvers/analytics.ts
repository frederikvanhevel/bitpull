import { GraphQLFieldResolver } from 'graphql'
import AnalyticsService from 'services/analytics'
import { AnalyticsPeriod } from 'services/analytics/typedefs'
import Logger from 'utils/logging/logger'
import { AuthenticationContext } from '../directives/auth'

export const getTotalsPerJob: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    { period: AnalyticsPeriod }
> = async (root, args, context) => {
    try {
        return await AnalyticsService.getTotalsPerJob(context.user, args.period)
    } catch (error) {
        Logger.throw(
            new Error('Could not get job anaytics'),
            error,
            context.user
        )
    }
}

export const getTotalsPerDay: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    { period: AnalyticsPeriod }
> = async (root, args, context) => {
    try {
        return await AnalyticsService.getTotalsForPeriod(
            context.user,
            args.period
        )
    } catch (error) {
        Logger.throw(new Error('Could not get analytics'), error, context.user)
    }
}
