import { Schema, model, Document, Types } from 'mongoose'
import { FlowNode } from '@bitpull/worker'

export interface CatalogItem {
    _id?: Types.ObjectId
    id: string
    name: string
    title: string
    description?: string
    node: FlowNode
    visible?: boolean
}

export type CatalogDocument = CatalogItem & Document

const CatalogSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    node: {
        type: Object,
        required: true
    },
    visible: {
        type: Boolean,
        default: true,
        index: true
    }
})

const CatalogModel = model<CatalogDocument>('Catalog', CatalogSchema, 'catalog')

export default CatalogModel
