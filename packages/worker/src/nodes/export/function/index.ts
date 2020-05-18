import assert from 'assert'
import { NodeParser } from '../../../typedefs/node'
import { FunctionNode } from './typedefs'
import { FunctionError } from './errors'

const functionNode: NodeParser<FunctionNode> = async input => {
    const { node } = input

    assert(node.function, FunctionError.NO_FUNCTION_SPECIFIED)

    const isAsync = node.function.constructor.name === "AsyncFunction"

    if (isAsync) {
        await node.function(input)
    } else {
        node.function(input)
    }

    return Promise.resolve(input)
}

export default functionNode
