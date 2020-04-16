import { GraphQLFieldResolver } from 'graphql'
import EncryptionSerivce from 'services/encryption'
import Logger from 'utils/logging/logger'
import { AuthenticationContext } from '../directives/auth'
import MailService from 'services/mail'

export const encrypt: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    { text: string }
> = (root, args, context): string => {
    try {
        return EncryptionSerivce.encrypt(args.text)
    } catch (error) {
        Logger.throw(new Error('Could not encrypt data'), error, context.user)
    }
}

export const decrypt: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    { text: string }
> = (root, args, context): string => {
    try {
        return EncryptionSerivce.decrypt(args.text)
    } catch (error) {
        Logger.throw(new Error('Could not decrypt data'), error, context.user)
    }
}

export const feedback: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = (root, args, context) => {
    try {
        MailService.sendFeedbackEmail(context.user, args.type, args.question)
        return true
    } catch (error) {
        Logger.throw(new Error('Could not send feedback'), error, context.user)
    }
}
