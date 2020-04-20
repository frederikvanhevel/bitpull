import { mocked } from 'ts-jest'
import { NodeType } from '../../../../typedefs/node'
import { FunctionNode } from '../../../../nodes/export/function/typedefs'
import paginationNodeMock from '../__mocks__/pagination.mock'
import complexPaginationNodeMock from '../__mocks__/complex.mock'
import Traverser from '../../../../traverse'
import CustomBrowser from '../../../../browser'
import * as delay from '../../../../utils/delay'

jest.mock('../../../../utils/delay')
const mockedDelay = mocked(delay, true)

const htmlPageOne = `
    <html>
        <body>
            <div class="list">
                <a class="fieldOne" href="/some-path">link</a>
                <div class="fieldTwo">1400</div>
            </div>
            <a class="next" href="/rooms/1">next</a>
        </body>
    </html>
`

const htmlPageTwo = `
    <html>
        <body>
            <div class="list">
                <a class="fieldOne" href="/some-other-path">link</a>
                <div class="fieldTwo">400</div>
                <a class="next" href="/rooms/2">next</a>
            </div>
        </body>
    </html>
`

const htmlPageThree = `
    <html>
        <body>
            <div class="list">
                <a class="fieldOne" href="/some-down-path">link</a>
                <div class="fieldTwo">480</div>
            </div>
        </body>
    </html>
`

const htmlPageFour = `
    <html>
        <body>
            <div class="list">
                <div class="field">480</div>
            </div>
        </body>
    </html>
`

describe('Pagination node', () => {
    let traverser: Traverser
    let browser: CustomBrowser

    beforeAll(async () => {
        browser = new CustomBrowser()
        await browser.initialize()
        browser.setMockHandler(url => {
            switch (url) {
                case 'https://test.be/rooms/1':
                    return { body: htmlPageTwo }
                case 'https://test.be/rooms/2':
                    return { body: htmlPageThree }
                case 'https://test.be/some-down-path':
                    return { body: htmlPageFour }
                default:
                    return { body: htmlPageOne }
            }
        })

        traverser = new Traverser(
            {
                settings: {},
                onError: (a, e) => console.log(e)
            },
            browser
        )

        mockedDelay.randomizedDelay.mockImplementation(() => Promise.resolve())
    })

    afterAll(async () => {
        await traverser.cleanup()
    })

    test('should parse a pagination node', async () => {
        const page = await browser.newPage()
        await page.goto('https://test.be')

        const mockFn = jest.fn()
        const node = { ...paginationNodeMock }

        node.children!.push({
            id: '3',
            type: NodeType.FUNCTION,
            function: mockFn
        } as FunctionNode)

        const expected = [
            { price: 1400, url: '/some-path' },
            { price: 400, url: '/some-other-path' },
            { price: 480, url: '/some-down-path' }
        ]

        await traverser.parseNode({
            node,
            rootAncestor: {
                id: '00',
                type: NodeType.HTML,
                link: 'https://test.be'
            },
            page
        })

        expect(mockFn.mock.calls.length).toEqual(1)
        expect(mockFn.mock.calls[0][0]).toEqual(expected)
    }, 10000)

    test('should limit amount of parsed links', async () => {
        const page = await browser.newPage()
        await page.goto('https://test.be')

        const mockFn = jest.fn()
        const node = { ...paginationNodeMock }

        node.linkLimit = 1

        node.children![1] = {
            id: '3',
            type: NodeType.FUNCTION,
            function: mockFn
        } as FunctionNode

        const expected = [{ price: 1400, url: '/some-path' }]

        await traverser.parseNode({
            node,
            rootAncestor: {
                id: '00',
                type: NodeType.HTML,
                link: 'https://test.be'
            },
            page
        })

        expect(mockFn.mock.calls.length).toEqual(1)
        expect(mockFn.mock.calls[0][0]).toEqual(expected)
    })

    test.skip('should parse a pagination node with a link list', async () => {
        const mockFn = jest.fn()

        const node = { ...paginationNodeMock }

        // @ts-ignore
        delete node.pagination.nextLink

        // @ts-ignore
        node.pagination.linkList = ['/rooms/1', '/rooms/2']

        node.children![1] = {
            id: '3',
            type: NodeType.FUNCTION,
            function: mockFn
        } as FunctionNode

        const expected = [
            { price: 1400, url: '/some-path' },
            { price: 400, url: '/some-other-path' },
            { price: 480, url: '/some-down-path' }
        ]

        await traverser.parseNode({
            node,
            rootAncestor: {
                id: '00',
                type: NodeType.HTML,
                link: 'https://brik.mykot.be'
            },
            parentResult: { html: htmlPageOne }
        })

        expect(mockFn.mock.calls.length).toEqual(1)
        expect(mockFn.mock.calls[0][0]).toEqual(expected)
    })

    test('should parse a complex pagination node', async () => {
        const page = await browser.newPage()
        await page.goto('https://test.be')

        const mockFn = jest.fn()
        const node = { ...complexPaginationNodeMock }

        node.children!.push({
            id: '3',
            type: NodeType.FUNCTION,
            function: mockFn
        } as FunctionNode)

        const expected = [
            { price: 1400, url: '/some-path' },
            { price: 400, url: '/some-other-path' },
            { price: 480, url: '/some-down-path', new: 480 }
        ]

        await traverser.parseNode({
            node,
            rootAncestor: {
                id: '00',
                type: NodeType.HTML,
                link: 'https://test.be'
            },
            page
        })

        expect(mockFn.mock.calls.length).toEqual(1)
        expect(mockFn.mock.calls[0][0]).toEqual(expected)
    })
})
