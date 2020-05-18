import dotenv from 'dotenv'
dotenv.config()
import Database from 'components/data/mongodb'
import MigrationModel from 'models/migrations'
import Logger from 'utils/logging/logger'

class Store {
    async load(fn: Function) {
        try {
            await Database.connect()
            const migrations = await MigrationModel.findOne({})

            if (!migrations) {
                Logger.info(
                    'Cannot read migrations from database. If this is the first time you run migrations, then this is normal.'
                )
                return fn(null, {})
            }

            fn(null, migrations)
        } catch (error) {
            Logger.error(new Error('Could not load migrations'), error)
        } finally {
            await Database.disconnect()
        }
    }

    async save(set: any, fn: Function) {
        try {
            await Database.connect()

            const result = await MigrationModel.updateOne(
                {},
                {
                    $set: {
                        lastRun: set.lastRun
                    },
                    $push: {
                        migrations: { $each: set.migrations }
                    }
                },
                {
                    upsert: true,
                    new: true
                }
            )

            fn(null, result)
        } catch (error) {
            Logger.error(new Error('Could not save migrations'), error)
        } finally {
            await Database.disconnect()
        }
    }
}

export = Store
