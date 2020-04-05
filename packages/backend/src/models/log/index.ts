import { Document, Schema, model } from 'mongoose'
import { LogType, NodeId, NodeType } from '@bitpull/worker'

interface LogEntry {
    date: Date
    type: LogType
    nodeId: NodeId
    nodeType: NodeType
    message: string
}

export interface Log {
    status: string
    log: LogEntry[]
    workflow: string
    job: string
    date: Date
}

type LogDocument = Log & Document

const LogSchema = new Schema({
    status: String,
    logs: [
        {
            date: Date,
            type: {
                type: String,
                default: 'info',
                enum: ['INFO', 'ERROR', 'WARN']
            },
            nodeId: String,
            nodeType: String,
            message: String
        }
    ],
    workflow: { type: Schema.Types.ObjectId, ref: 'Workflow' },
    job: { type: Schema.Types.ObjectId, ref: 'Job' },
    date: {
        type: Date,
        default: Date.now
    }
})

const LogModel = model<LogDocument>('Log', LogSchema)

export default LogModel
