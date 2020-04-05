import { NodeType } from '../../../../typedefs/node'
import { LoginNode } from '../typedefs'

export default {
    id: '0',
    type: NodeType.LOGIN,
    credentials: {
        username: {
            selector: '#username',
            value: 'johnny'
        },
        password: {
            selector: '#password',
            value: 'azertyuiop'
        },
        submit: '#submit'
    }
} as LoginNode
