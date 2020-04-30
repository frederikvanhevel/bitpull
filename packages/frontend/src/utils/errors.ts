import { ApolloError } from 'apollo-boost'

export const getError = (error: Error | ApolloError) => {
    if (
        !(error as ApolloError).graphQLErrors.length &&
        (error as ApolloError).networkError
    ) {
        return 'We are currently undergoing maintenance. Please try again later.'
    }
    return error.message.replace('GraphQL error: ', '')
}
