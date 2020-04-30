import { NodeType } from '../../../typedefs/node'
import { TestEnvironment } from '../../utils/environment'
import { createNode } from '../../utils/factory'

jest.setTimeout(10000)

describe('Click node', () => {
    const environment = new TestEnvironment()

    beforeAll(async () => {
        await environment.setup()
    })

    afterAll(async () => {
        await environment.cleanup()
    })

    it('should throw when selector is not defined', async () => {
        const node = createNode(NodeType.CLICK)

        const promise = environment.parseNode({ node })
        await expect(promise).rejects.toThrow()
    })

    it('should throw when selector is not found', async () => {
        const node = createNode(NodeType.CLICK, {
            selector: 'none'
        })

        const promise = environment.parseNode({ node })
        await expect(promise).rejects.toThrow()
    })
})
