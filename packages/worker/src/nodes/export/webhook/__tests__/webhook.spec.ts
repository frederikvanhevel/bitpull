import nock from 'nock'

import webhookNodeMock from '../__mocks__/webhook.mock'
import parseWebhookNode from '../'
import { writeFile, FileType } from '../../../../utils/file'
import { NodeType } from '../../../../typedefs/node'

const DEFAULT_OPTIONS = {
    integrations: [],
    settings: {}
}

describe('Webhook node', () => {
    test('should parse a webhook node with json', async () => {
        const expected = {
            test: 'hello'
        }

        nock('http://localhost:3000')
            .post('/api/test', { data: expected })
            .reply(200)

        await parseWebhookNode(
            {
                node: webhookNodeMock,
                parent: {
                    id: '00',
                    type: NodeType.COLLECT
                },
                passedData: expected
            },
            DEFAULT_OPTIONS,
            //@ts-ignore
            {}
        )
    })

    test('should parse a webhook node with a file', async () => {
        const expected = { data: 'test' }
        const filePath = await writeFile(
            JSON.stringify(expected),
            FileType.JSON
        )

        nock('http://localhost:3000')
            .matchHeader('content-type', val =>
                val.includes('multipart/form-data')
            )
            .post('/api/test')
            .reply(200)

        await parseWebhookNode(
            {
                node: webhookNodeMock,
                parent: {
                    id: '00',
                    type: NodeType.JSON
                },
                passedData: {
                    path: filePath,
                    fileName: 'test.json',
                    contentType: 'application/json'
                }
            },
            DEFAULT_OPTIONS,
            // @ts-ignore
            {}
        )
    })
})
