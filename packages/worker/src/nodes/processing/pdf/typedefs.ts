import { FlowNode, NodeType } from '../../../typedefs/node'

export enum PdfFormat {
    LETTER = 'Letter',
    LEGAL = 'Legal',
    TABLOID = 'Tabloid',
    LEDGER = 'Ledger',
    A0 = 'A0',
    A1 = 'A1',
    A2 = 'A2',
    A3 = 'A3',
    A4 = 'A4',
    A5 = 'A5',
    A6 = 'A6'
}

export type PdfNode = FlowNode & {
    type: NodeType.PDF
    landscape: boolean
    format: PdfFormat
}
