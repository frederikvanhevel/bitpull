import { Document, Schema, model } from 'mongoose'
import { StorageService, StorageObject } from '@bitpull/worker'
import { WorkflowDocument } from 'models/workflow'
import { UserDocument } from '../user'

export enum ResourceType {
    JOB = 'JOB',
    TEST_RUN = 'TEST_RUN'
}

export interface Resource {
    resourceType: ResourceType
    resourceName: string
    resourceId?: string | WorkflowDocument['_id']
    data: StorageObject
}

export interface StorageLink {
    service: StorageService
    url: string
    fileName: string
    contentType: string
    createdAt: Date
    expiryDate?: Date
}

export interface Storage {
    links: StorageLink[]
    resourceType: ResourceType
    resourceId: Schema.Types.ObjectId
    resourceName: string
    owner: string | UserDocument['_id']
    updatedAt: Date
}

type StorageDocument = Storage & Document

const LinkSchema = new Schema({
    service: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        required: true
    }
})

const StorageSchema = new Schema({
    links: [LinkSchema],
    count: {
        type: Number,
        default: 0
    },
    resourceType: {
        type: String,
        enum: ['JOB', 'TEST_RUN'],
        required: true,
        index: true
    },
    resourceId: {
        type: Schema.Types.ObjectId
    },
    resourceName: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const StorageModel = model<StorageDocument>('Storage', StorageSchema, 'storage')

export default StorageModel
