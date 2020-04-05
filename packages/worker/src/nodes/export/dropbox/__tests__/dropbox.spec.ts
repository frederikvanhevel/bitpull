import nock from 'nock'

import dropboxNodeMock from '../__mocks__/dropbox.mock'
import parseDropboxNode from '../'
import { writeFile, FileType } from '../../../../utils/file'
import { IntegrationType } from '../../../../typedefs/common'

describe('Dropbox node', () => {
    test('should upload to dropbox', async () => {
        const file = await writeFile('test', FileType.JSON)

        nock('https://content.dropboxapi.com')
            .post('/2/files/upload', 'test')
            .reply(200)

        await parseDropboxNode(
            {
                node: dropboxNodeMock,
                passedData: { path: file, fileName: 'test.json' }
            },
            {
                integrations: [
                    {
                        type: IntegrationType.DROPBOX,
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
