import assert from 'assert'
import { NodeParser } from '../../../typedefs/node'
import { FunctionNode } from './typedefs'
import { FunctionError } from './errors'

const functionNode: NodeParser<FunctionNode> = input => {
    const { node, passedData } = input

    assert(node.function, FunctionError.NO_FUNCTION_SPECIFIED)

    node.function(passedData)

    return Promise.resolve(input)
}

export default functionNode
