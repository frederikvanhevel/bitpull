import { ApolloClient } from 'apollo-client'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-boost'
import { setContext } from 'apollo-link-context'
import { v4 as uuidv4 } from 'uuid'

const TRACING_HEADER = 'x-trace-id'

// Create an http link:
const httpLink = new HttpLink({
    uri: process.env.BACKEND + '/graphql'
})

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token')
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
            [TRACING_HEADER]: uuidv4()
        }
    }
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: process.env.WS_BACKEND + '/graphql',
    options: {
        reconnect: true,
        timeout: 30000
        // reconnect: true,
        // connectionParams: {
        //     token: localStorage.getItem('token') || undefined
        // }
    }
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query)
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        )
    },
    wsLink,
    authLink.concat(httpLink)
)

const client = new ApolloClient({
    // uri: process.env.BACKEND + '/graphql',
    link,
    cache: new InMemoryCache(),
    queryDeduplication: false // necessary to be able to cancel queries
})

export default client
