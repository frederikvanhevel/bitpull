import { Types } from 'mongoose'
import WorkflowModel from 'models/workflow'
import { FlowNode, NodeType } from '@bitpull/worker'

const fixProperties = (node: FlowNode) => {
    const fix = (innerNode: FlowNode) => {
        // @ts-ignore
        if (innerNode.gotoOnEnd) {
            // @ts-ignore
            innerNode.goToOnEnd = innerNode.gotoOnEnd
            // @ts-ignore
            delete innerNode.gotoOnEnd
        }

        // @ts-ignore
        if (innerNode.linkedField) {
            innerNode.type = NodeType.HTML_LINKED
            // @ts-ignore
            delete innerNode.link
        }

        // @ts-ignore
        if (innerNode.link) {
            // @ts-ignore
            delete innerNode.linkedField
        }

        if (innerNode.children) {
            for (let i = 0; i < innerNode.children.length; i++) {
                fix(innerNode.children[i])
            }
        }

        return innerNode
    }

    return fix(node)
}

export const migrate = async () => {
    const workflows = await WorkflowModel.find()

    workflows.forEach(async workflow => {
        workflow.node = fixProperties(workflow.node)

        await WorkflowModel.collection.updateOne(
            { _id: Types.ObjectId(workflow.id) },
            {
                $set: { node: fixProperties(workflow.node) }
            }
        )
    })
}
