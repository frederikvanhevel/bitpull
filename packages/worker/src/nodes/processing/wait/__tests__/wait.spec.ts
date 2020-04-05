import CustomBrowser from '../../../../browser'
import waitNodeMock from '../__mocks__/wait.mock'
import waitNode from '../'
import { NodeType } from '../../../../typedefs/node'

const html = `
    <html>
        <head></head>
        <body>
            <h1>Html content</h1>
        </body>
    </html>
`

describe('Wait node', () => {
    let browser: CustomBrowser

    beforeAll(async () => {
        browser = new CustomBrowser()
        await browser.initialize()
        browser.setMockHandler(() => ({
            body: html
        }))
    })

    afterAll(async () => {
        await browser.cleanup()
        browser.resetMockHandler()
    })

    test.skip('should wait 2 seconds', async () => {
        const result = await waitNode(
            {
                node: waitNodeMock,
                rootAncestor: {
                    id: '00',
                    type: NodeType.HTML,
                    parseJavascript: true,
                    parsedLink: 'https://brik.mykot.be/rooms'
                }
            },
            { integrations: [], settings: {} },
            // @ts-ignore
            { browser }
        )

        expect(result.passedData!.path).toBeDefined()
    })
})
