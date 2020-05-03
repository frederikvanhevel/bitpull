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

describe('Google Drive node', () => {
    const environment = new TestEnvironment()

    beforeAll(async () => {
        await environment.setup()

        nock('https://www.googleapis.com')
            .persist()
            .post('/upload/drive/v3/files?uploadType=multipart')
            .reply(200, {
                id: '123',
                name: 'test.json'
            })

        nock('https://www.googleapis.com')
            .get('/drive/v3/files/123?fields=webViewLink')
            .reply(200, {
                webViewLink: 'https://google.com/test.json'
            })
    })

    afterAll(async () => {
        await environment.cleanup()
    })

    it('should fail when integration is not set up', async () => {
        const node = createNode(NodeType.GOOGLE_DRIVE)
        const file = await writeFile('test', FileType.JSON)
        const input = createInput(node, { path: file, fileName: 'test.json' })
        const promise = environment.parseNode(input)
        await expect(promise).rejects.toThrow()
    })

    it('should post file to dropbox', async () => {
        environment.setOptions({
            integrations: [createIntegration(IntegrationType.GOOGLE_DRIVE)]
        })
        const node = createNode(NodeType.GOOGLE_DRIVE)
        const file = await writeFile('test', FileType.JSON)
        const input = createInput(node, { path: file, fileName: 'test.json' })
        const result = await environment.parseNode(input)
        expect(result).toBeDefined()
    })

    it('should call onStorage', async () => {
        const storageFn = jest.fn()
        environment.setOptions({
            integrations: [createIntegration(IntegrationType.GOOGLE_DRIVE)],
            onStorage: storageFn
        })

        const node = createNode(NodeType.GOOGLE_DRIVE)
        const file = await writeFile('test', FileType.JSON)
        const input = createInput(node, {
            path: file,
            fileName: 'test.json',
            contentType: 'json'
        })

        await environment.parseNode(input)
        expect(input).toBeDefined()
        expect(storageFn).toHaveBeenCalledWith({
            service: 'GOOGLE_DRIVE',
            fileName: 'test.json',
            url: 'https://google.com/test.json',
            contentType: 'json'
        })
    })
})
