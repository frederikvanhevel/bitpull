import { SchemaDirectiveVisitor } from 'graphql-tools'
import { defaultFieldResolver } from 'graphql'
import MemoryStore from 'utils/store/memory'
import { ApolloError } from 'apollo-server'
import { AuthenticationContext } from './auth'

const loggedIps = new MemoryStore(10000)

class TooManyRequestsError extends ApolloError {
    constructor(message: string) {
        super(message, 'TOO_MANY_REQUESTS')

        Object.defineProperty(this, 'name', { value: 'TooManyRequestsError' })
    }
}

export class RateLimitDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: any) {
        const { resolve = defaultFieldResolver } = field

        field.resolve = async function (...args: any) {
            const [, , context]: [any, any, AuthenticationContext] = args
            const ip = context.req!.ip

            if (loggedIps.count(ip) > 1) {
                throw new TooManyRequestsError(
                    'Too many requests, please try again later.'
                )
            }

            loggedIps.add(ip)

            try {
                return await resolve.apply(this, args)
            } finally {
                loggedIps.remove(ip)
            }
        }
    }
}
