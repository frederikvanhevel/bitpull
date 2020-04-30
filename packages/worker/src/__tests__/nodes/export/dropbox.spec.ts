import nock from 'nock'
import { IntegrationType } from '../../../typedefs/common'
import {
    createInput,
    createNode,
    createIntegration
} from '../../../__tests__/utils/factory'
import { TestEnvironment } from '../../utils/environment'
import { writeFile, FileType } from '../../../utils/file'
import { NodeType } from '../../../typedefs/node'

jest.setTimeout(10000)

describe('Dropbox node', () => {
    const environment = new TestEnvironment()

    beforeAll(async () => {
        await environment.setup()

        nock('https://content.dropboxapi.com')
            .persist()
            .post('/2/files/upload', 'test')
            .reply(200)

        nock('https://api.dropboxapi.com')
            .post('/2/sharing/create_shared_link_with_settings', {
                path: '/test.json',
                settings: {
                    requested_visibility: 'public'
                }
            })
            .reply(200, {
                name: 'test.json',
                url: 'https://dropbox.com/test.json',
                preview_type: 'html'
            })
    })

    afterAll(async () => {
        await environment.cleanup()
    })

    it('should fail when integration is not set up', async () => {
        const node = createNode(NodeType.DROPBOX)
        const file = await writeFile('test', FileType.JSON)
        const input = createInput(node, { path: file, fileName: 'test.json' })
        const promise = environment.parseNode(input)
        await expect(promise).rejects.toThrow()
    })

    it('should post file to dropbox', async () => {
        environment.setOptions({
            integrations: [createIntegration(IntegrationType.DROPBOX)]
        })
        const node = createNode(NodeType.DROPBOX)
        const file = await writeFile('test', FileType.JSON)
        const input = createInput(node, { path: file, fileName: 'test.json' })
        const result = await environment.parseNode(input)
        expect(result).toBeDefined()
    })

    it('should call onStorage', async () => {
        const storageFn = jest.fn()
        environment.setOptions({
            integrations: [createIntegration(IntegrationType.DROPBOX)],
            onStorage: storageFn
        })

        const node = createNode(NodeType.DROPBOX)
        const file = await writeFile('test', FileType.JSON)
        const input = createInput(node, {
            path: file,
            fileName: 'test.json',
            contentType: 'json'
        })

        await environment.parseNode(input)
        expect(input).toBeDefined()
        expect(storageFn).toHaveBeenCalledWith({
            service: 'DROPBOX',
            fileName: 'test.json',
            url: 'https://dropbox.com/test.json',
            contentType: 'json'
        })
    })
})
