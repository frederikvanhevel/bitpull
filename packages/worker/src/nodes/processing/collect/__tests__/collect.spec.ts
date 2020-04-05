import collectNodeMock from '../__mocks__/collect.mock'
import collect from '../'

const DEFAULT_OPTIONS = {
    integrations: [],
    settings: {}
}

const html = `
    <html>
        <body>
            <div class="list">
                <div class="item">
                    <a class="fieldOne" href="/some-path">link</a>
                    <div class="fieldTwo">1400</div>
                </div>
                <div class="item">
                    <a class="fieldOne" href="/some-other-path">other link</a>
                    <div class="fieldTwo">430</div>
                </div>
            </div>
        </body>
    </html>
`

const html2 = `
    <html>
        <body>
            <div class="list">
                <div class="item">
                    <a href="/some-path">
                        <div class="fieldOne">link</div>
                    </a>
                </div>
                <div class="item">
                    <a href="/some-other-path">
                        <div class="fieldOne">other link</div>
                    </a>
                </div>
            </div>
        </body>
    </html>
`

describe('Collect node', () => {
    test('should parse a collect node as an array', async () => {
        const expected = [
            { url: '/some-path', price: 1400 },
            { price: 430, url: '/some-other-path' }
        ]
        const result = await collect(
            {
                node: collectNodeMock,
                parentResult: { html }
            },
            DEFAULT_OPTIONS,
            // @ts-ignore
            { browser: undefined }
        )

        expect(result.passedData).toEqual(expected)
    })

    test('should find nested value when attribute is specified', async () => {
        let expected = [{ url: '/some-path' }, { url: '/some-other-path' }]

        const result = await collect(
            {
                node: collectNodeMock,
                parentResult: { html: html2 }
            },
            DEFAULT_OPTIONS,
            // @ts-ignore
            { browser: undefined }
        )

        expect(result.passedData).toEqual(expected)

        const nodeWithoutAtrr = { ...collectNodeMock }

        delete nodeWithoutAtrr.fields[0].selector.attribute

        const resultWithoutAttribute = await collect(
            {
                node: nodeWithoutAtrr,
                parentResult: { html: html2 }
            },
            DEFAULT_OPTIONS,
            // @ts-ignore
            { browser: undefined }
        )

        expected = [{ url: 'link' }, { url: 'other link' }]

        expect(resultWithoutAttribute.passedData).toEqual(expected)
    })
})
