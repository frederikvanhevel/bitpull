import { NodeType } from '../typedefs/node'
import { TestEnvironment } from './utils/environment'
import { createNode } from './utils/factory'

describe('Traverser', () => {
    it('should get a result object', async () => {
        const environment = new TestEnvironment()
        await environment.setup({
            settings: {
                exitOnError: false
            }
        })

        const node = createNode(NodeType.HTML, {
            link: 'http://test.be'
        })

        const result = await environment.run(node)

        expect(result).toEqual({
            status: 'SUCCESS',
            errors: [],
            logs: [
                {
                    type: 'INFO',
                    date: expect.anything(),
                    nodeType: 'HTML',
                    message: 'Got content of http://test.be'
                }
            ],
            files: []
        })

        await environment.cleanup()
    })

    it('should not throw when exitOnError is false', async () => {
        const environment = new TestEnvironment()
        await environment.setup({
            settings: {
                exitOnError: false
            }
        })

        const node = createNode(NodeType.HTML, {
            link: 'http://test.be',
            children: [createNode(NodeType.COLLECT)]
        })

        const result = await environment.run(node)

        expect(result).toEqual({
            status: 'PARTIAL_SUCCESS',
            errors: [
                {
                    nodeType: 'COLLECT',
                    date: expect.anything(),
                    message: 'Selector fields are missing',
                    code: 'FIELDS_MISSING'
                }
            ],
            logs: [
                {
                    type: 'INFO',
                    date: expect.anything(),
                    nodeType: 'HTML',
                    message: 'Got content of http://test.be'
                },
                {
                    type: 'ERROR',
                    date: expect.anything(),
                    nodeType: 'COLLECT',
                    message: 'Selector fields are missing'
                }
            ],
            files: []
        })

        await environment.cleanup()
    })

    it('should throw when exitOnError is true', async () => {
        const environment = new TestEnvironment()
        await environment.setup({
            settings: {
                exitOnError: true
            }
        })

        const node = createNode(NodeType.HTML, {
            link: 'http://test.be',
            children: [createNode(NodeType.COLLECT)]
        })

        const result = await environment.run(node)

        expect(result).toEqual({
            status: 'ERROR',
            errors: [
                {
                    nodeType: 'COLLECT',
                    date: expect.anything(),
                    message: 'Selector fields are missing',
                    code: 'FIELDS_MISSING'
                },
                {
                    nodeType: 'HTML',
                    date: expect.anything(),
                    message: 'Selector fields are missing',
                    code: 'FIELDS_MISSING'
                }
            ],
            logs: [
                {
                    type: 'INFO',
                    date: expect.anything(),
                    nodeType: 'HTML',
                    message: 'Got content of http://test.be'
                },
                {
                    type: 'ERROR',
                    date: expect.anything(),
                    nodeType: 'COLLECT',
                    message: 'Selector fields are missing'
                },
                {
                    type: 'ERROR',
                    date: expect.anything(),
                    nodeType: 'HTML',
                    message: 'Selector fields are missing'
                }
            ],
            files: []
        })

        await environment.cleanup()
    })
})
