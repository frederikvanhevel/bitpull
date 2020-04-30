import { mocked } from 'ts-jest/utils'
import parseNodeMock from '../__mocks__/traverse.mock'
import errorsNodeMock from '../__mocks__/errors.mock'
import brikMock from '../__mocks__/brik.mock'
import Traverser from '../traverse'
import { NodeType } from '../typedefs/node'
import CustomBrowser from '../browser'
import * as delay from '../utils/delay'

jest.mock('../utils/delay')
const mockedDelay = mocked(delay, true)

const htmlPageOne = `
    <html>
        <body>
            <div class="list">
                <a class="fieldOne" href="/some-house">link</a>
                <div class="fieldTwo">1400</div>
            </div>
        </body>
    </html>
`

const htmlPageTwo = `
    <html>
        <body>
            <div class="type">house</div>
            <div class="surface">40</div>
        </body>
    </html>
`

describe('Traverser', () => {
    let traverser: Traverser
    let browser: CustomBrowser

    beforeAll(async () => {
        browser = new CustomBrowser()

        traverser = new Traverser(
            {
                settings: {
                    exitOnError: true
                },
                onError: (a, e) => console.log(e)
            },
            browser
        )

        mockedDelay.randomizedDelay.mockImplementation(() => Promise.resolve())
    })

    afterAll(async () => {
        await traverser.cleanup()
    })

    test('should parse a full tree', async () => {
        browser.setMockHandler(() => ({
            body: htmlPageOne
        }))

        const mockFn1 = jest.fn()
        const mockFn2 = jest.fn()

        const node = {
            id: '0',
            type: NodeType.HTML,
            link: 'https://brik.mykot.be/rooms',
            children: [
                {
                    id: '1',
                    type: NodeType.COLLECT,
                    fields: [
                        {
                            label: 'first',
                            selector: {
                                value: 'a.fieldOne',
                                attribute: 'href'
                            }
                        }
                    ],
                    children: [
                        {
                            id: '2',
                            type: NodeType.FUNCTION,
                            function: mockFn1
                        }
                    ]
                },
                {
                    id: '3',
                    type: NodeType.COLLECT,
                    fields: [
                        {
                            label: 'second',
                            selector: {
                                value: '.fieldTwo'
                            }
                        }
                    ],
                    children: [
                        {
                            id: '4',
                            type: NodeType.FUNCTION,
                            function: mockFn2
                        }
                    ]
                }
            ]
        }

        await traverser.parseNode({ node })

        expect(mockFn1.mock.calls[0][0]).toEqual({
            first: 'https://brik.mykot.be/some-house'
        })
        expect(mockFn1.mock.calls.length).toEqual(1)
        expect(mockFn2.mock.calls[0][0]).toEqual({ second: 1400 })
        expect(mockFn2.mock.calls.length).toEqual(1)
    })

    test('should parse a full tree', async () => {
        let handles = 0
        browser.setMockHandler(() => ({
            body: ++handles === 1 ? htmlPageOne : htmlPageTwo
        }))

        const mockFn = jest.fn()
        const node = { ...parseNodeMock }
        node.children[0].children.push({
            id: '3',
            type: NodeType.FUNCTION,
            // @ts-ignore
            function: mockFn
        })

        const expected = [
            {
                price: 1400,
                surface: 40,
                type: 'house',
                url: 'https://brik.mykot.be/some-house'
            }
        ]

        await traverser.parseNode({ node: parseNodeMock })

        expect(mockFn.mock.calls[0][0]).toEqual(expected)
        expect(mockFn.mock.calls.length).toEqual(1)
    })

    test.skip('should parse live brik rooms site', async () => {
        const mockFn = jest.fn()
        const node = { ...brikMock }
        node.children[0].children.push({
            id: '3',
            type: NodeType.FUNCTION,
            // @ts-ignore
            function: mockFn
        })

        const expected = [
            {
                price: 1400,
                surface: 40,
                type: 'house',
                url: 'https://brik.mykot.be/some-house'
            }
        ]

        await traverser.parseNode({ node: brikMock })

        expect(mockFn.mock.calls[0][0]).toEqual(expected)
        expect(mockFn.mock.calls.length).toEqual(1)
    })

    test('progress callback should be called for each node', async () => {
        let handles = 0
        browser.setMockHandler(() => ({
            body: ++handles === 1 ? htmlPageOne : htmlPageTwo
        }))

        const mockFn = jest.fn()

        const tra = new Traverser({
            onStart: mockFn,
            settings: {}
        })

        await tra.parseNode({
            node: parseNodeMock
        })

        expect(mockFn.mock.calls.length).toEqual(4)

        await tra.cleanup()
    })

    test('logging callback should be called while running', async () => {
        let handles = 0
        browser.setMockHandler(() => ({
            body: ++handles === 1 ? htmlPageOne : htmlPageTwo
        }))

        const mockFn = jest.fn()

        const tra = new Traverser({
            onLog: mockFn,
            settings: {}
        })

        const result = await tra.run(parseNodeMock)

        expect(mockFn.mock.calls.length).toBeGreaterThan(0)
        expect(result.logs.length).toEqual(5)

        await tra.cleanup()
    })

    test('error callback should be called on error', async () => {
        let handles = 0
        browser.setMockHandler(() => ({
            body: ++handles === 1 ? htmlPageOne : htmlPageTwo
        }))

        const mockFn = jest.fn()

        const modifiedNode = { ...parseNodeMock }
        delete modifiedNode.link

        const tra = new Traverser({
            onError: mockFn,
            settings: {
                exitOnError: true
            }
        })

        await expect(tra.parseNode({ node: modifiedNode })).rejects.toThrow()
        expect(mockFn.mock.calls.length).toEqual(1)

        await tra.cleanup()
    })

    test.skip('should throw when pagination endNode is missing', async () => {
        let handles = 0
        browser.setMockHandler(() => ({
            body: ++handles === 1 ? htmlPageOne : htmlPageTwo
        }))

        const modifiedNode = { ...parseNodeMock }
        modifiedNode.children[0].children.splice(1, 1)

        await expect(
            traverser.parseNode({ node: modifiedNode })
        ).rejects.toThrow()
    })

    test('should throw when pagination per page node is missing', async () => {
        let handles = 0
        browser.setMockHandler(() => ({
            body: ++handles === 1 ? htmlPageOne : htmlPageTwo
        }))

        const modifiedNode = { ...parseNodeMock }
        modifiedNode.children[0].children.splice(0, 1)

        await expect(
            traverser.parseNode({ node: modifiedNode })
        ).rejects.toThrow()
    })

    test('should call onError on error', async () => {
        let handles = 0
        browser.setMockHandler(() => ({
            body: ++handles === 1 ? htmlPageOne : htmlPageTwo
        }))

        const mockFn = jest.fn()

        const modifiedNode = { ...parseNodeMock }
        modifiedNode.children[0].children.splice(0, 1)

        const tra = new Traverser({
            onError: mockFn,
            settings: {
                exitOnError: true
            }
        })

        const promise = tra.parseNode({ node: modifiedNode })

        await expect(promise).rejects.toThrow()
        expect(mockFn.mock.calls.length).toEqual(1)

        await tra.cleanup()
    })

    test('should throw when too many errors occured', async () => {
        let handles = 0
        browser.setMockHandler(() => ({
            body: ++handles === 1 ? htmlPageOne : htmlPageTwo
        }))

        const mockFn = jest.fn()

        const modifiedNode = { ...errorsNodeMock }

        const tra = new Traverser({
            onError: mockFn,
            settings: {
                exitOnError: false,
                maxErrorsBeforeExit: 2
            }
        })

        await tra.run(modifiedNode)

        expect(mockFn.mock.calls.length).toEqual(2)

        await tra.cleanup()
    })

    test('should continue onError when exitOnError is false', async () => {
        let handles = 0
        browser.setMockHandler(() => ({
            body: ++handles === 1 ? htmlPageOne : htmlPageTwo
        }))

        const mockFn = jest.fn()

        const modifiedNode = { ...parseNodeMock }
        modifiedNode.children[0].children.splice(0, 1)

        const tra = new Traverser({
            onError: mockFn,
            settings: {
                exitOnError: false
            }
        })

        const promise = tra.run(modifiedNode)

        await expect(promise).resolves.not.toThrow()

        const result = await promise

        expect(result.errors).toHaveLength(1)
        expect(result.errors).toContainEqual(
            expect.objectContaining({
                nodeId: '1',
                nodeType: 'PAGINATION',
                code: 'CHILD_NODE_MISSING'
            })
        )
        expect(mockFn.mock.calls.length).toEqual(1)

        await tra.cleanup()
    })

    // test('should cancel processing', async () => {
    //     setMockHandler(async () => {
    //         await delay(100)
    //         return {
    //             body: htmlPageOne
    //         }
    //     })

    //     traverser.run(parseNodeMock)

    //     await expect(traverser.forceCancel()).rejects.toThrow()

    //     resetMockHandler()
    // })
})
