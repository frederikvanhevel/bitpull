import nock from 'nock'
import { IntegrationType } from '../../../typedefs/common'
import {
    createInput,
    createNode,
    createIntegration
} from '../../../__tests__/utils/factory'
import { TestEnvironment } from '../../utils/environment'
import {
    writeFile,
    FileType,
    readFile,
    FileEncoding
} from '../../../utils/file'
import { NodeType } from '../../../typedefs/node'

jest.setTimeout(10000)

describe('Github node', () => {
    const environment = new TestEnvironment()
    let file: string
    let read: string

    beforeAll(async () => {
        await environment.setup()

        file = await writeFile('test', FileType.JSON)
        read = await readFile(file, FileEncoding.BASE64)

        nock('https://api.github.com')
            .persist()
            .put('/repos/user/myrepo/contents/test.json', {
                message: 'Uploaded file via BitPull.io',
                committer: {
                    name: 'BitPull.io',
                    email: 'bot@bitpull.io'
                },
                content: read
            })
            .reply(200, {
                content: {
                    name: 'test.json',
                    html_url: 'https://github.com/myrepo/test.json'
                }
            })
    })

    afterAll(async () => {
        await environment.cleanup()
    })

    it('should fail when repo is not specified', async () => {
        const node = createNode(NodeType.GITHUB)
        const input = createInput(node, { path: file, fileName: 'test.json' })
        const promise = environment.parseNode(input)
        await expect(promise).rejects.toThrow()
    })

    it('should fail when integration is not set up', async () => {
        const node = createNode(NodeType.GITHUB, {
            repo: 'user/myrepo'
        })
        const input = createInput(node, { path: file, fileName: 'test.json' })
        const promise = environment.parseNode(input)
        await expect(promise).rejects.toThrow()
    })

    it('should fail when repo is not valid', async () => {
        const node = createNode(NodeType.GITHUB, {
            repo: 'myrepo'
        })
        const input = createInput(node, { path: file, fileName: 'test.json' })
        const promise = environment.parseNode(input)
        await expect(promise).rejects.toThrow()
    })

    it('should post file to dropbox', async () => {
        environment.setOptions({
            integrations: [createIntegration(IntegrationType.GITHUB)]
        })
        const node = createNode(NodeType.GITHUB, {
            repo: 'user/myrepo'
        })
        const input = createInput(node, { path: file, fileName: 'test.json' })
        const result = await environment.parseNode(input)
        expect(result).toBeDefined()
    })

    it('should call onStorage', async () => {
        const storageFn = jest.fn()
        environment.setOptions({
            integrations: [createIntegration(IntegrationType.GITHUB)],
            onStorage: storageFn
        })

        const node = createNode(NodeType.GITHUB, {
            repo: 'user/myrepo'
        })
        const input = createInput(node, {
            path: file,
            fileName: 'test.json',
            contentType: 'json'
        })

        await environment.parseNode(input)
        expect(input).toBeDefined()
        expect(storageFn).toHaveBeenCalledWith({
            service: 'GITHUB',
            fileName: 'test.json',
            url: 'https://github.com/myrepo/test.json',
            contentType: 'json'
        })
    })
})
