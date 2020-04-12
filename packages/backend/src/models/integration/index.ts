import { Document, Schema, model } from 'mongoose'
import { IntegrationType, IntegrationSettings } from '@bitpull/worker'
import { UserDocument } from '../user'

export interface Integration extends Document {
    type: IntegrationType
    active: boolean
    settings: IntegrationSettings
    owner: string | UserDocument['_id']
}

export type IntegrationDocument = Integration & Document

const IntegrationSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    settings: {
        type: Object,
        default: {}
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
})

const IntegrationModel = model<IntegrationDocument>(
    'Integration',
    IntegrationSchema
)

export default IntegrationModel
