import mongoose from 'mongoose'

export const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
    } catch (error) {
        throw new Error('Could not connect to database')
    }
}
