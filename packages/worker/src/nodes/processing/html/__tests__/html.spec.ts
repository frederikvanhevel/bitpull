import CustomBrowser from '../../../../browser'
import htmlNodeMock from '../__mocks__/html.mock'
import parseHtmlNode from '../'
import { HtmlNode } from '../typedefs'

const html = `
    <html>
        <head></head>
        <body>
            <div class="list">
                <a class="fieldOne" href="/some-path">link</a>
                <div class="fieldTwo">1400</div>
            </div>

            <script>
                var element = document.createElement('div');
                var text = document.createTextNode("Javascript was here");
                element.appendChild(text);
                document.body.appendChild(element);
            </script>
        </body>
    </html>
`

describe('Html node', () => {
    let browser: CustomBrowser

    beforeAll(async () => {
        browser = new CustomBrowser()
        await browser.initialize()
    })

    afterAll(async () => {
        await browser.cleanup()
    })

    test('should parse a url node and get the html', async () => {
        browser.setMockHandler(() => ({
            body: html
        }))

        const result = await parseHtmlNode(
            { node: htmlNodeMock },
            { settings: {} },
            // @ts-ignore
            { browser }
        )

        const parsedHtml = await result.page!.content()

        expect(parsedHtml.replace(/\s/g, '')).toContain('<div>Javascript')
    })

    test('should parse a url node and go to the url in the linked field', async () => {
        browser.setMockHandler(() => ({
            body: html
        }))

        const node = {
            ...htmlNodeMock,
            children: [{ linkedField: 'url' } as HtmlNode]
        }

        const result = await parseHtmlNode(
            {
                node: node.children[0],
                parent: node,
                passedData: {
                    url: '/rooms'
                },
                rootAncestor: node
            },
            { integrations: [], settings: {} },
            // @ts-ignore
            { browser }
        )

        const parsedHtml = await result.page!.content()

        expect(parsedHtml.replace(/\s/g, '')).toContain('<div>Javascript')
    })
})
