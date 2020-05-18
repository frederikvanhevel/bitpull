import { Document, Schema, model } from 'mongoose'

export interface Migration {
    lastRun: string
    migrations: object[]
}

type MigrationDocument = Migration & Document

const MigrationSchema = new Schema({
    lastRun: String,
    migrations: [Schema.Types.Mixed]
})

const MigrationModel = model<MigrationDocument>('Migration', MigrationSchema)

export default MigrationModel
