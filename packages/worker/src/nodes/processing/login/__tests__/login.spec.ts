import loginNodeMock from '../__mocks__/login.mock'
import parseLoginNode from '../'
import Traverser from '../../../../traverse'
import { NodeType } from '../../../../typedefs/node'
import CustomBrowser from '../../../../browser'

const beforeLogin = `
    <html>
        <head></head>
        <body>
            <form method="post" action="https://test-page2.be">
                <input type="text" id="username"/>
                <input type="text" id="password"/>
                <input type="submit" value="Submit" id="submit"/>
            </form>
        </body>
    </html>
`

const afterLogin = `
    <html>
        <head></head>
        <body>
            <div>Successfully logged in!</div>
        </body>
    </html>
`

describe('Login node', () => {
    let browser: CustomBrowser

    beforeAll(async () => {
        browser = new CustomBrowser()
        await browser.initialize()
    })

    afterAll(async () => {
        await browser.cleanup()
    })

    test('should parse a login node and get the html', async () => {
        let handles = 0
        browser.setMockHandler(() => ({
            body: ++handles === 1 ? beforeLogin : afterLogin
        }))

        const page = await browser.newPage()
        await page.goto('https://test-page.be')

        const result = await parseLoginNode(
            {
                node: loginNodeMock,
                rootAncestor: {
                    id: '00',
                    type: NodeType.HTML,
                    parsedLink: 'https://test-page.be'
                },
                page
            },
            {
                integrations: [],
                settings: {
                    exitOnError: true,
                    encryption: {
                        version: 'v1',
                        key: '123'
                    }
                }
            },
            // @ts-ignore
            { browser }
        )

        const parsedHtml = await result.page!.content()
        expect(parsedHtml.replace(/\s/g, '')).toEqual(
            afterLogin.replace(/\s/g, '')
        )

        browser.resetMockHandler()
    })

    test('should parse a login node with an encrypted password', async () => {
        let handles = 0
        browser.setMockHandler(() => ({
            body: ++handles === 1 ? beforeLogin : afterLogin
        }))

        const page = await browser.newPage()
        await page.goto('https://test-page.be')

        const encryptedMock = { ...loginNodeMock }
        encryptedMock.credentials.password.encrypted = true

        const result = await parseLoginNode(
            {
                node: encryptedMock,
                rootAncestor: {
                    id: '00',
                    type: NodeType.HTML,
                    parsedLink: 'https://test-page.be'
                },
                page
            },
            {
                integrations: [],
                settings: {
                    exitOnError: true,
                    encryption: {
                        version: 'v1',
                        key: '123'
                    }
                }
            },
            // @ts-ignore
            { browser }
        )

        const parsedHtml = await result.page!.content()
        expect(parsedHtml.replace(/\s/g, '')).toEqual(
            afterLogin.replace(/\s/g, '')
        )

        browser.resetMockHandler()
    })

    test('should throw when an enryption key is missing', async () => {
        let handles = 0
        browser.setMockHandler(() => ({
            body: ++handles === 1 ? beforeLogin : afterLogin
        }))

        const page = await browser.newPage()
        await page.goto('https://test-page.be')

        const encryptedMock = { ...loginNodeMock }
        encryptedMock.credentials.password.encrypted = true

        const traverserWIthoutKey = new Traverser({
            settings: {
                exitOnError: true
            }
        })

        const result = traverserWIthoutKey.parseNode({
            node: encryptedMock,
            rootAncestor: {
                id: '00',
                type: NodeType.HTML,
                parsedLink: 'https://test-page.be'
            },
            page
        })

        expect(result).rejects.toThrow()

        browser.resetMockHandler()
    })
})
