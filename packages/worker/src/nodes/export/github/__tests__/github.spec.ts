import nock from 'nock'

import githubNodeMock from '../__mocks__/github.mock'
import parseGithubNode from '../'
import { writeFile, FileType } from '../../../../utils/file'
import { IntegrationType } from '../../../../typedefs/common'

describe('Github node', () => {
    test('should upload to github', async () => {
        const file = await writeFile('test', FileType.JSON)

        nock('https://api.github.com')
            .put('/repos/frederikvanhevel/test-data/contents/test.json')
            .reply(200, {
                content: {
                    name: 'test.json',
                    url: 'http://github.com/test.json'
                }
            })

        await parseGithubNode(
            {
                node: githubNodeMock,
                passedData: { path: file, fileName: 'test.json' }
            },
            {
                integrations: [
                    {
                        type: IntegrationType.GITHUB,
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
