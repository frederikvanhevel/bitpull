import { createServer } from 'http'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import passport from 'passport'
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import UserService from 'services/user'
import schema from 'controllers/graphql/schema'
import UserModel from 'models/user'
import Database from 'components/data/mongodb'
import Logger from 'utils/logging/logger'
import { GraphQLError } from 'graphql'
import apiRouter from 'controllers/rest/routes'
import webhookRouter from 'controllers/webhooks'
import JobController from 'controllers/jobs'
import Segment from 'components/segment'
import { tracingMiddleware } from 'utils/logging/tracing'
import { migrate } from 'migrations/goToPerPage'

export const startServer = async () => {
    await Database.connect()

    const server = new ApolloServer({
        schema,
        tracing: process.env.NODE_ENV !== 'production',
        context: async ({ req, connection }) => {
            if (connection) return connection.context

            return {
                user: req.user,
                req
            }
        },
        formatError: (error: GraphQLError) => {
            Logger.error(error)
            return error
        }
    })

    const options: StrategyOptions = {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(options, async (payload, done) => {
        const user = await UserService.getUser(payload.id)
        return done(null, user)
    })

    const app = express()

    app.set('trust proxy', true)
    app.use(tracingMiddleware)
    app.use(helmet())
    app.use(
        cors({
            origin: process.env.APP_URL
        })
    )
    passport.use(strategy)
    passport.initialize()
    passport.use(UserModel.createStrategy())
    passport.serializeUser(UserModel.serializeUser())
    passport.deserializeUser(UserModel.deserializeUser())

    app.use('/graphql', (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            req.user = user
            next()
        })(req, res, next)
    })

    app.use('/api', apiRouter)
    app.use('/webhooks', webhookRouter)
    app.get('/health', (req, res) => {
        const success = Database.isHealthy()
        res.status(success ? 200 : 500).send({
            success
        })
    })

    server.applyMiddleware({ app })
    const httpServer = createServer(app)
    server.installSubscriptionHandlers(httpServer)

    const port = process.env.PORT || 5000

    httpServer.listen({ port }, () =>
        Logger.info(
            `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
        )
    )

    JobController.startJobProcessor()
    JobController.startStorageCleanup()
    JobController.startAnalyticsCleanup()

    Segment.initialize()

    migrate()
}

// temporary workaround for workflow cancels
process.on('unhandledRejection', reason => {
    // @ts-ignore
    if (reason?.message !== 'Operation was cancelled') throw reason
})
