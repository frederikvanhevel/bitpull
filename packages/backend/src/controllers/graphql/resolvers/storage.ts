import { GraphQLFieldResolver } from 'graphql'
import StorageService from 'services/storage'
import { Storage } from 'models/storage'
import Logger from 'utils/logging/logger'
import { AuthenticationContext } from '../directives/auth'

export const getStorageEntry: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context) => {
    try {
        return await StorageService.getEntry(
            context.user,
            args.id,
            args.offset,
            args.limit
        )
    } catch (error) {
        Logger.throw(
            new Error('Could not get storage entry'),
            error,
            context.user
        )
    }
}

export const getStorageEntries: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context): Promise<Storage[]> => {
    try {
        return await StorageService.getEntries(context.user, args.resourceType)
    } catch (error) {
        Logger.throw(
            new Error('Could not get storage entries'),
            error,
            context.user
        )
    }
}
