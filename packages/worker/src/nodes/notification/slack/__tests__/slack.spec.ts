import nock from 'nock'

import slackNodeMock from '../__mocks__/slack.mock'
import parseSlackNode from '../'
import { NodeType } from '../../../../typedefs/node'
import { IntegrationType } from '../../../../typedefs/common'

describe('Slack node', () => {
    test('should parse a slack node', async () => {
        const expected = {
            channel: 'general',
            attachments: [
                {
                    fallback: 'File was successfully uploaded to Google Drive:',
                    pretext: 'File was successfully uploaded to Google Drive:',
                    title: 'some-file.pdf',
                    title_link: 'http://google.be'
                }
            ]
        }

        nock('https://slack.com')
            .post('/api/chat.postMessage', expected)
            .reply(200, {
                ok: true
            })

        await parseSlackNode(
            {
                node: slackNodeMock,
                parent: {
                    id: '00',
                    type: NodeType.GOOGLE_DRIVE
                },
                passedData: {
                    name: 'some-file.pdf',
                    url: 'http://google.be'
                }
            },
            {
                integrations: [
                    {
                        type: IntegrationType.SLACK,
                        active: true,
                        settings: {
                            access_token: 'token'
                        }
                    }
                ],
                settings: {}
            },
            // @ts-ignore
            {}
        )
    })
})
