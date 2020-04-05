import { Schema, model, Types, Document } from 'mongoose'
import { FlowNode, NodeType } from '@bitpull/worker'
import { UserDocument } from '../user'

interface WorkflowSettings {
    useProxy: boolean
}

export interface Workflow {
    _id: Types.ObjectId
    id: string
    name: string
    settings?: WorkflowSettings
    owner: string | UserDocument['_id']
    node: FlowNode
}

export type WorkflowDocument = Workflow & Document

const DEFAULT_NODE = {
    id: Types.ObjectId(),
    type: NodeType.HTML,
    link: ''
}

const WorkflowSchema = new Schema(
    {
        name: {
            type: String,
            default: 'New workflow',
            required: true,
            trim: true,
            index: true
        },
        node: {
            type: Object,
            default: DEFAULT_NODE,
            required: true
        },
        settings: {
            useProxy: {
                type: Boolean,
                default: false
            }
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
)

const WorkflowModel = model<WorkflowDocument>('Workflow', WorkflowSchema)

export default WorkflowModel
