import { NodeType } from '../../../../typedefs/node'
import clickNodeMock from '../__mocks__/click.mock'
import parseClickNode from '../'
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

describe('Click node', () => {
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

    test('should parse a click node and get the html', async () => {
        const result = await parseClickNode(
            {
                node: clickNodeMock,
                rootAncestor: {
                    id: '00',
                    type: NodeType.HTML,
                    parseJavascript: true,
                    parsedLink: 'https://brik.mykot.be/rooms'
                } as HtmlNode
            },
            { integrations: [], settings: {} },
            // @ts-ignore
            { browser }
        )

        expect(result.parentResult!.html.replace(/\s/g, '')).toEqual(
            renderedHtml.replace(/\s/g, '')
        )
        expect(true).toBe(true)
    })

    test('should parse a click node and get the html from parent result', async () => {
        const result = await parseClickNode(
            {
                node: clickNodeMock,
                rootAncestor: {
                    id: '00',
                    type: NodeType.HTML,
                    parseJavascript: true
                } as HtmlNode,
                parentResult: {
                    html,
                    url: 'http://google.be'
                }
            },
            { integrations: [], settings: {} },
            // @ts-ignore
            { browser }
        )

        expect(result.parentResult!.html.replace(/\s/g, '')).toEqual(
            renderedHtml.replace(/\s/g, '')
        )
        expect(true).toBe(true)
    })
})
