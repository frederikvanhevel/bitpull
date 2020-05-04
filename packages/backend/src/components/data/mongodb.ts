import mongoose from 'mongoose'
import Config from 'utils/config'
import Logger from 'utils/logging/logger'

const connect = async () => {
    try {
        await mongoose.connect(Config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
    } catch (error) {
        Logger.throw(new Error('Could not connect to database'), error)
    }
}

const isHealthy = () =>
    mongoose.connection.readyState === mongoose.STATES.connected

const Database = {
    connect,
    isHealthy
}

export default Database
