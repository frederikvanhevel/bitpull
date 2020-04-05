import nock from 'nock'

import googleDriveNodeMock from '../__mocks__/google-drive.mock'
import parseGoogleDriveNode from '../'
import { writeFile, FileType } from '../../../../utils/file'
import { IntegrationType } from '../../../../typedefs/common'

describe('Google Drive node', () => {
    test('should upload to google drive', async () => {
        const file = await writeFile('test', FileType.JSON)

        nock('https://www.googleapis.com')
            .post('/upload/drive/v3/files?uploadType=multipart', value =>
                value.includes('test.json')
            )
            .reply(200)

        await parseGoogleDriveNode(
            {
                node: googleDriveNodeMock,
                passedData: { path: file, fileName: 'test.json' }
            },
            {
                integrations: [
                    {
                        type: IntegrationType.GOOGLE_DRIVE,
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
