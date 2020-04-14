import mongoose from 'mongoose'

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!, {
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
