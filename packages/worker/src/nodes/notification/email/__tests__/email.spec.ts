import { mocked } from 'ts-jest/utils'
import emailNodeMock from '../__mocks__/email.mock'
import parseEmailNode from '../'
import { NodeType } from '../../../../typedefs/node'
import * as mail from '../../../../utils/email'

jest.mock('../../../../utils/email')
const mockedSendMail = mocked(mail)

describe('Email node', () => {
    test('should parse an email node', async () => {
        const settings = {
            settings: {
                email: {
                    apiKey: '123',
                    to: 'john@example.com',
                    template: '123'
                }
            }
        }

        await parseEmailNode(
            {
                node: emailNodeMock,
                parent: {
                    id: '00',
                    type: NodeType.GOOGLE_DRIVE
                },
                passedData: {
                    name: 'some-name.pdf',
                    url: 'http://google.be'
                }
            },
            settings,
            // @ts-ignore
            {}
        )

        expect(mockedSendMail.sendMail).toHaveBeenCalledWith(
            {
                to: settings.settings.email.to,
                params: {
                    message:
                        'File was successfully uploaded to Google Drive: <a href="http://google.be">some-name.pdf</a>',
                    metaData: undefined
                }
            },
            settings.settings
        )
    })
})
