import { NodeType } from '../../../../typedefs/node'
import scrollNodeMock from '../__mocks__/scroll.mock'
import parseScrollNode from '../'
import { HtmlNode } from '../../html/typedefs'
import CustomBrowser from '../../../../browser'

const html = `
    <html>
        <head></head>
        <body>
            <button onclick="myFunction();">Click me</button>

            <script>
                function myFunction() {
                    var element = document.createElement('div');
                    var text = document.createTextNode('Javascript was here');
                    element.appendChild(text);
                    document.body.appendChild(element);
                }
            </script>
        </body>
    </html>
`

const renderedHtml = `
    <html>
        <head></head>
        <body>
            <button onclick="myFunction();">Click me</button>

            <script>
                function myFunction() {
                    var element = document.createElement('div');
                    var text = document.createTextNode('Javascript was here');
                    element.appendChild(text);
                    document.body.appendChild(element);
                }
            </script>

            <div>Javascript was here</div>
        </body>
    </html>
`

describe.skip('Scroll node', () => {
    let browser: CustomBrowser

    beforeAll(async () => {
        browser = new CustomBrowser()
        await browser.initialize()
        browser.setMockHandler(() => ({
            body: html
        }))
    })

    afterAll(async () => {
        browser.resetMockHandler()
        await browser.cleanup()
    })

    test('should parse a scroll node and get the html', async () => {
        browser.setMockHandler(() => ({
            body: html
        }))

        const page = await browser.newPage()
        await page.goto('https://test-page.be')

        const result = await parseScrollNode(
            {
                node: scrollNodeMock,
                rootAncestor: {
                    id: '00',
                    type: NodeType.HTML
                } as HtmlNode,
                page
            },
            { integrations: [], settings: {} },
            // @ts-ignore
            { browser }
        )

        const parsedHtml = await result.page!.content()
        expect(parsedHtml.replace(/\s/g, '')).toEqual(
            renderedHtml.replace(/\s/g, '')
        )
        expect(true).toBe(true)
    })
})
