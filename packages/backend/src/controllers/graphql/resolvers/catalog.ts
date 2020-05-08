import { GraphQLFieldResolver } from 'graphql'
import CatalogService from 'services/catalog'
import Logger from 'utils/logging/logger'
import { CatalogItem } from 'typedefs/graphql'
import { AuthenticationContext } from '../directives/auth'

export const getCatalogItems: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context) => {
    try {
        return await CatalogService.getItems()
    } catch (error) {
        Logger.throw(
            new Error('Could not get catalog items'),
            error,
            context.user
        )
    }
}

export const addCatalogItem: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context) => {
    try {
        return await CatalogService.addItem(args.data as any)
    } catch (error) {
        Logger.throw(
            new Error('Could not add catalog item'),
            error,
            context.user
        )
    }
}

export const pickCatalogItem: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    { id: string }
> = async (root, args, context) => {
    try {
        return await CatalogService.pickItem(context.user, args.id)
    } catch (error) {
        Logger.throw(
            new Error('Could not pick catalog item'),
            error,
            context.user
        )
    }
}
