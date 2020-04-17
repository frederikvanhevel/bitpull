import assert from 'assert'
import { absolutifyUrl, absolutifyHtml } from '../absolutify'

describe('absolutify', () => {

    // // Non-changing string, should not get replaced
    // const ok =
    //     '' +
    //     '<img src="www.foo.com" />' +
    //     '<img src="google.com" />' +
    //     '<img src="http://www.bar.com" />' +
    //     '<img src="//baz.com" />'

    // it('string replace', () => {
    //     assert.strictEqual(
    //         absolutify(
    //             '<a href="/relative">Heyo</a>' + ok,
    //             'http://www.example.com'
    //         ),
    //         '<a href="http://www.example.com/relative">Heyo</a>' + ok
    //     )

    //     assert.strictEqual(
    //         absolutify(
    //             '<a href="../relative">Heyo</a>' + ok,
    //             'http://www.example.com'
    //         ),
    //         '<a href="http://www.example.com/../relative">Heyo</a>' + ok
    //     )

    //     assert.strictEqual(
    //         absolutify('<a href="/">Heyo</a>' + ok, 'http://www.example.com'),
    //         '<a href="http://www.example.com/">Heyo</a>' + ok
    //     )
    // })

    // it('string replace single quote', () => {
    //     assert.strictEqual(
    //         absolutify(
    //             "<a href='../relative'>Heyo</a>" + ok,
    //             'http://www.example.com'
    //         ),
    //         "<a href='http://www.example.com/../relative'>Heyo</a>" + ok
    //     )
    // })

    // it('string multi-replace', () => {
    //     assert.strictEqual(
    //         absolutify(
    //             '<a href="/relative">Heyo</a><form action="/index.php">' + ok,
    //             'http://www.example.com'
    //         ),
    //         '<a href="http://www.example.com/relative">Heyo</a><form action="http://www.example.com/index.php">' +
    //             ok
    //     )
    // })

    // it('string replace anchor', () => {
    //     assert.strictEqual(
    //         absolutify(
    //             '<a href="#section">Section</a>' + ok,
    //             'http://www.example.com'
    //         ),
    //         '<a href="http://www.example.com/#section">Section</a>' + ok
    //     )
    // })

    // it.only('function replace', () => {
    //     assert.strictEqual(
    //         absolutifyHtml('<a href="/relative">Heyo</a>' + ok, 'http://www.example.com'),
    //         '<a href="http://www.example.com/relative">Heyo</a>' + ok
    //     )

    //     assert.strictEqual(
    //         absolutifyHtml('<a href="../two">Heyo</a>' + ok, 'http://www.example.com'),
    //         '<a href="http://www.example.com/public/../two">Heyo</a>' + ok
    //     )

    //     assert.strictEqual(
    //         absolutifyHtml('<a href="./three">Heyo</a>' + ok, 'http://www.example.com'),
    //         '<a href="http://www.example.com/./three">Heyo</a>' + ok
    //     )
    // })

    // it('function replace anchor', () => {
    //     assert.strictEqual(
    //         absolutify('<a href="#section">Section</a>' + ok, url => {
    //             return 'http://www.example.com' + url
    //         }),
    //         '<a href="http://www.example.com#section">Section</a>' + ok
    //     )
    // })

    // it('function multi-replace', () => {
    //     assert.strictEqual(
    //         absolutify(
    //             '<a href="/relative">Heyo</a><form action="/index.php">' + ok,
    //             url => {
    //                 return 'http://www.example.com' + url
    //             }
    //         ),
    //         '<a href="http://www.example.com/relative">Heyo</a><form action="http://www.example.com/index.php">' +
    //             ok
    //     )
    // })

    it('convert relative url to absolute', () => {
        assert.strictEqual(
            absolutifyUrl(
                '/rooms',
                'https://brik.mykot.be'
            ),
            'https://brik.mykot.be/rooms'
        )
        
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

        assert.strictEqual(
            absolutifyUrl('docs/schemaorg.css', 'https://schema.org'),
            'https://schema.org/docs/schemaorg.css'
        )
    })

    it('convert relative html to absolute', () => {
        // console.log(absolutifyHtml('<link rel="stylesheet" type="text/css" href="docs/schemaorg.css" />', 'https://schema.org'))
        assert.strictEqual(
            absolutifyHtml(
                '<link rel="stylesheet" type="text/css" href="docs/schemaorg.css" />',
                'https://schema.org'
            ),
            '<link rel="stylesheet" type="text/css" href="https://schema.org/docs/schemaorg.css" />'
        )

        assert.strictEqual(
            absolutifyHtml(
                '<link rel="stylesheet" type="text/css" href="https://schema.org/docs/schemaorg.css" />',
                'https://schema.org'
            ),
            '<link rel="stylesheet" type="text/css" href="https://schema.org/docs/schemaorg.css" />'
        )

        assert.strictEqual(
            absolutifyHtml(
                '<link rel="stylesheet" type="text/css" href="//schema.org/docs/schemaorg.css" />',
                'https://schema.org'
            ),
            '<link rel="stylesheet" type="text/css" href="//schema.org/docs/schemaorg.css" />'
        )

        assert.strictEqual(
            absolutifyHtml(
                '<link rel="stylesheet" type="text/css" href="/docs/schemaorg.css" />',
                'https://schema.org'
            ),
            '<link rel="stylesheet" type="text/css" href="https://schema.org/docs/schemaorg.css" />'
        )

        // const raw = `
        //     <!DOCTYPE html>
        //     <html lang="en">
        //     <!-- Generated from genericTermPageHeader.tpl -->
        //     <head>
        //     <!-- Generated from headtags.tpl -->
        //         <meta charset="utf-8" >
        //         <link rel="shortcut icon" type="image/png" href="docs/favicon.ico"/>
        //         <link rel="stylesheet" type="text/css" href="docs/schemaorg.css" />
        //         <link rel="stylesheet" type="text/css" href="docs/prettify.css" />
        //         <script type="text/javascript" src="docs/prettify.js"></script>

        //         <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
        //     <!-- ##### Generated insert [CSEScript-start] see scripts/genhtmlinserts.sh ##### -->
        // `

        // assert.strictEqual(
        //     absolutifyHtml(raw, 'https://schema.org', 'http://proxy.be?url='),
        //     '<link rel="stylesheet" type="text/css" href="https://schema.org/docs/schemaorg.css" />'
        // )
    })
})
