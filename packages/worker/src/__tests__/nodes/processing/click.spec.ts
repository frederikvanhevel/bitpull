import { NodeType } from '../../../typedefs/node'
import { TestEnvironment, containsResult } from '../../utils/environment'
import { createNode } from '../../utils/factory'
import { HtmlNode } from '../../../nodes/processing/html/typedefs'

jest.setTimeout(10000)

describe('Click node', () => {
    const environment = new TestEnvironment()

    beforeAll(async () => {
        await environment.setup()
    })

    afterAll(async () => {
        await environment.cleanup()
    })

    describe('Single', () => {
        it('should throw when selector is not defined', async () => {
            const node = createNode(NodeType.CLICK)

            const promise = environment.parseNode({ node })
            await expect(promise).rejects.toThrow()
        })

        it('should throw when no elements are found', async () => {
            const node = createNode(NodeType.CLICK, {
                selector: 'none'
            })

            const promise = environment.parseNode({ node })
            await expect(promise).rejects.toThrow()
        })

        it('should click on an element', async () => {
            const node = createNode<HtmlNode>(NodeType.HTML, {
                link: 'https://test.be/',
                children: [
                    createNode(NodeType.CLICK, {
                        selector: 'button'
                    })
                ]
            })

            environment.mockPage({
                url: 'https://test.be/',
                content: `
                    <button onclick="myFunction();">Click me</button>
                    <script>
                        function myFunction() {
                            var element = document.createElement('div');
                            var text = document.createTextNode('javascript was here');
                            element.appendChild(text);
                            document.body.appendChild(element);
                        }
                    </script>
                `
            })

            const result = await environment.parseNode({ node })
            expect(containsResult(result, '<div>javascript was here</div>'))
        })
    })

    describe('Multiple', () => {
        it('should throw when selector is not defined', async () => {
            const node = createNode(NodeType.CLICK_MULTIPLE)

            const promise = environment.parseNode({ node })
            await expect(promise).rejects.toThrow()
        })

        it('should traverse nodes for each found element', async () => {
            const fn = jest.fn()
            const node = createNode<HtmlNode>(NodeType.HTML, {
                link: 'https://test.be/',
                children: [
                    createNode(NodeType.CLICK_MULTIPLE, {
                        selector: 'button',
                        children: [
                            createNode(NodeType.FUNCTION, {
                                function: fn
                            })
                        ]
                    })
                ]
            })

            environment.mockPage({
                url: 'https://test.be/',
                content: `
                    <button onclick="myFunction('one');">Click me</button>
                    <button onclick="myFunction('two');">Click me as well</button>
                    <script>
                        function myFunction(text) {
                            var element = document.createElement('div');
                            var text = document.createTextNode(text + ' was here');
                            element.appendChild(text);
                            document.body.appendChild(element);
                        }
                    </script>
                `
            })

            const result = await environment.parseNode({ node })
            expect(containsResult(result, '<div>one was here</div>'))
            expect(containsResult(result, '<div>two was here</div>'))
            expect(fn).toHaveBeenCalledTimes(2)
        })

        it('should traverse nodes and gather data for each found element', async () => {
            const fn = jest.fn()
            const node = createNode<HtmlNode>(NodeType.HTML, {
                link: 'https://test.be/',
                children: [
                    createNode(NodeType.CLICK_MULTIPLE, {
                        selector: 'button',
                        goToPerPage: '1',
                        goToOnEnd: '2',
                        children: [
                            createNode(NodeType.COLLECT, {
                                id: '1',
                                append: true,
                                fields: [
                                    {
                                        label: 'result',
                                        selector: {
                                            value: '#result'
                                        }
                                    }
                                ]
                            }),
                            createNode(NodeType.FUNCTION, {
                                id: '2',
                                function: fn
                            })
                        ]
                    })
                ]
            })

            environment.mockPage({
                url: 'https://test.be/',
                content: `
                    <button onclick="myFunction('one');">Click me</button>
                    <button onclick="myFunction('two');">Click me as well</button>
                    <div id="result"></div>
                    <script>
                        function myFunction(text) {
                            var element = document.getElementById('result');
                            element.innerHTML = text;
                        }
                    </script>
                `
            })

            await environment.parseNode({ node })
            expect(fn).toHaveBeenCalledWith(
                expect.objectContaining({
                    passedData: [
                        {
                            result: 'one'
                        },
                        {
                            result: 'two'
                        }
                    ]
                })
            )
        })
    })
})
