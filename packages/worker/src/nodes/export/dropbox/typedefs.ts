import { FlowNode, NodeType } from '../../../typedefs/node'

export type DropboxNode = FlowNode & {
    type: NodeType.DROPBOX
    useDirectory: boolean
    directory: string
    filename: string
    overwrite: boolean
}

export interface DropboxArgs {
    path: string
    mode: string
    autorename: boolean
    mute: boolean
    strict_conflict?: boolean
}
