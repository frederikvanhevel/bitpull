import nock from 'nock'

import oneDriveDriveNodeMock from '../__mocks__/onedrive.mock'
import parseOneDriveNode from '../'
import { writeFile, FileType } from '../../../../utils/file'
import { IntegrationType } from '../../../../typedefs/common'

describe('OneDrive node', () => {
    test('should upload to onedrive', async () => {
        const file = await writeFile('test', FileType.JSON)

        nock('https://graph.microsoft.com')
            .put('/v1.0/drive/root:/test.json:/content')
            .reply(200, {
                name: 'test.json',
                webUrl: 'dfdf'
            })

        await parseOneDriveNode(
            {
                node: oneDriveDriveNodeMock,
                passedData: { path: file, fileName: 'test.json' }
            },
            {
                integrations: [
                    {
                        type: IntegrationType.ONEDRIVE,
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
