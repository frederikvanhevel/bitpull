import { mergeSchemas } from 'graphql-tools'
import { PubSub } from 'apollo-server'
import {
    IsAuthenticatedDirective,
    IsSuperuserDirective
} from '../directives/auth'
import { RateLimitDirective } from '../directives/limit'
import userSchema from './user'
import workflowSchema from './workflow'
import analyticsSchema from './analytics'
import integrationSchema from './integration'
import jobSchema from './job'
import storageSchema from './storage'
import utilitySchema from './utility'
import paymentSchema from './payment'
import catalogSchema from './catalog'

export const pubsub = new PubSub()

export default mergeSchemas({
    schemas: [
        userSchema,
        workflowSchema,
        analyticsSchema,
        integrationSchema,
        jobSchema,
        storageSchema,
        utilitySchema,
        paymentSchema,
        catalogSchema
    ],
    schemaDirectives: {
        // @ts-ignore
        isAuthenticated: IsAuthenticatedDirective,
        // @ts-ignore
        isSuperuser: IsSuperuserDirective,
        // @ts-ignore
        RateLimit: RateLimitDirective
    }
})
