import CustomBrowser from '../../../../browser'
import screenshotNodeMock from '../__mocks__/screenshot.mock'
import screenshotNode from '../'
import { NodeType } from '../../../../typedefs/node'

const html = `
    <html>
        <head></head>
        <body>
            <h1>Screenshot contents</h1>
        </body>
    </html>
`

describe('Screenshot node', () => {
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

    test('should take a screenshot', async () => {
        const page = await browser.newPage()
        await page.goto('https://brik.mykot.be/rooms')

        const result = await screenshotNode(
            {
                node: screenshotNodeMock,
                rootAncestor: {
                    id: '00',
                    type: NodeType.HTML,
                    parsedLink: 'https://brik.mykot.be/rooms'
                },
                page
            },
            { integrations: [], settings: {} },
            // @ts-ignore
            { browser }
        )

        expect(result.passedData!.path).toBeDefined()
    })

    test('should take a screenshot from a parent result', async () => {
        const page = await browser.newPage()
        await page.goto('https://brik.mykot.be/rooms')

        const result = await screenshotNode(
            {
                node: screenshotNodeMock,
                rootAncestor: {
                    id: '00',
                    type: NodeType.HTML
                },
                page
            },
            { integrations: [], settings: {} },
            // @ts-ignore
            { browser }
        )

        expect(result.passedData!.path).toBeDefined()
    })
})
