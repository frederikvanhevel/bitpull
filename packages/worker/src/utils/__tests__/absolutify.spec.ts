import assert from 'assert'
import absolutify, { absolutifyUrl } from '../absolutify'

describe('absolutify', () => {
    // Non-changing string, should not get replaced
    const ok =
        '' +
        '<img src="www.foo.com" />' +
        '<img src="google.com" />' +
        '<img src="http://www.bar.com" />' +
        '<img src="//baz.com" />'

    it('string replace', () => {
        assert.strictEqual(
            absolutify(
                '<a href="/relative">Heyo</a>' + ok,
                'http://www.example.com'
            ),
            '<a href="http://www.example.com/relative">Heyo</a>' + ok
        )

        assert.strictEqual(
            absolutify(
                '<a href="../relative">Heyo</a>' + ok,
                'http://www.example.com'
            ),
            '<a href="http://www.example.com/../relative">Heyo</a>' + ok
        )

        assert.strictEqual(
            absolutify('<a href="/">Heyo</a>' + ok, 'http://www.example.com'),
            '<a href="http://www.example.com/">Heyo</a>' + ok
        )
    })

    it('string replace single quote', () => {
        assert.strictEqual(
            absolutify(
                "<a href='../relative'>Heyo</a>" + ok,
                'http://www.example.com'
            ),
            "<a href='http://www.example.com/../relative'>Heyo</a>" + ok
        )
    })

    it('string multi-replace', () => {
        assert.strictEqual(
            absolutify(
                '<a href="/relative">Heyo</a><form action="/index.php">' + ok,
                'http://www.example.com'
            ),
            '<a href="http://www.example.com/relative">Heyo</a><form action="http://www.example.com/index.php">' +
                ok
        )
    })

    it('string replace anchor', () => {
        assert.strictEqual(
            absolutify(
                '<a href="#section">Section</a>' + ok,
                'http://www.example.com'
            ),
            '<a href="http://www.example.com/#section">Section</a>' + ok
        )
    })

    it('function replace', () => {
        assert.strictEqual(
            absolutify('<a href="/relative">Heyo</a>' + ok, url => {
                return 'http://www.example.com' + url
            }),
            '<a href="http://www.example.com/relative">Heyo</a>' + ok
        )

        assert.strictEqual(
            absolutify('<a href="../two">Heyo</a>' + ok, url => {
                return 'http://www.example.com/public/' + url
            }),
            '<a href="http://www.example.com/public/../two">Heyo</a>' + ok
        )

        assert.strictEqual(
            absolutify('<a href="./three">Heyo</a>' + ok, url => {
                return 'http://www.example.com/' + url
            }),
            '<a href="http://www.example.com/./three">Heyo</a>' + ok
        )
    })

    it('function replace anchor', () => {
        assert.strictEqual(
            absolutify('<a href="#section">Section</a>' + ok, url => {
                return 'http://www.example.com' + url
            }),
            '<a href="http://www.example.com#section">Section</a>' + ok
        )
    })

    it('function multi-replace', () => {
        assert.strictEqual(
            absolutify(
                '<a href="/relative">Heyo</a><form action="/index.php">' + ok,
                url => {
                    return 'http://www.example.com' + url
                }
            ),
            '<a href="http://www.example.com/relative">Heyo</a><form action="http://www.example.com/index.php">' +
                ok
        )
    })

    it('convert relative url to absolute', () => {
        assert.strictEqual(
            absolutifyUrl('/index.php', 'http://www.google.be'),
            'http://www.google.be/index.php'
        )
        assert.strictEqual(
            absolutifyUrl('index.php', 'http://www.google.be'),
            'http://www.google.be/index.php'
        )
        assert.strictEqual(
            absolutifyUrl(
                'http://www.google.be/index.php',
                'http://www.google.be'
            ),
            'http://www.google.be/index.php'
        )
    })
})
