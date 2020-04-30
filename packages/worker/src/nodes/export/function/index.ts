import assert from 'assert'
import { NodeParser } from '../../../typedefs/node'
import { FunctionNode } from './typedefs'
import { FunctionError } from './errors'

const functionNode: NodeParser<FunctionNode> = input => {
    const { node } = input

    assert(node.function, FunctionError.NO_FUNCTION_SPECIFIED)

    node.function(input)

    return Promise.resolve(input)
}

export default functionNode
