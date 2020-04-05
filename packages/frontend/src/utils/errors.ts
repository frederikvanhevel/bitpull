import { ApolloError } from 'apollo-boost'

export const getError = (error: Error | ApolloError) => {
    return error.message.replace('GraphQL error: ', '')
}
