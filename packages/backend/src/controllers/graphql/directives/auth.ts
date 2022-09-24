import { SchemaDirectiveVisitor } from 'graphql-tools'
import { AuthenticationError } from 'apollo-server'
import { defaultFieldResolver } from 'graphql'
import { User } from 'models/user'
import { Request } from 'express'

export interface AuthenticationContext {
    user: User
    req?: Request
}

export class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: any) {
        const { resolve = defaultFieldResolver } = field

        field.resolve = async function (...args: any) {
            const [, , context]: [any, any, AuthenticationContext] = args

            if (!context.user) {
                throw new AuthenticationError(`Unauthenticated`)
            }

            return await resolve.apply(this, args)
        }
    }
}

export class IsSuperuserDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: any) {
        const { resolve = defaultFieldResolver } = field

        field.resolve = async function (...args: any) {
            const [, , context]: [any, any, AuthenticationContext] = args

            if (!context.user) {
                throw new AuthenticationError(`Unauthenticated`)
            }

            if (context.user.email !== 'xxxxx) {
                throw new AuthenticationError(`Not permitted`)
            }

            return await resolve.apply(this, args)
        }
    }
}
