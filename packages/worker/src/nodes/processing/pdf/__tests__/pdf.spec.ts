import CustomBrowser from '../../../../browser'
import pdfFileNodeMock from '../__mocks__/pdf.mock'
import pdfFileNode from '../'
import { NodeType } from '../../../../typedefs/node'

const html = `
    <html>
        <head></head>
        <body>
            <h1>Pdf contents</h1>
        </body>
    </html>
`

describe('Pdf node', () => {
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

    test('should write a pdf file', async () => {
        const result = await pdfFileNode(
            {
                node: pdfFileNodeMock,
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

    test('should write a pdf file from a parent result', async () => {
        const result = await pdfFileNode(
            {
                node: pdfFileNodeMock,
                rootAncestor: {
                    id: '00',
                    type: NodeType.HTML,
                    parseJavascript: true
                },
                parentResult: {
                    html,
                    url: 'http://google.be'
                }
            },
            { integrations: [], settings: {} },
            // @ts-ignore
            { browser }
        )

        expect(result.passedData!.path).toBeDefined()
    })
})
