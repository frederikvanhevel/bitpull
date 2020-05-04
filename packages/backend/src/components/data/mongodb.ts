import mongoose from 'mongoose'
import Config from 'utils/config'

const connect = async () => {
    try {
        await mongoose.connect(Config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
    } catch (error) {
        throw new Error('Could not connect to database')
    }
}

const isHealthy = () =>
    mongoose.connection.readyState === mongoose.STATES.connected

const Database = {
    connect,
    isHealthy
}

export default Database
