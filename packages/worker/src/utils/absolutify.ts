const REPLACE_REGEX = /((href|src|srcset|codebase|cite|background|cite|action|profile|formaction|icon|manifest|archive)=["'])(([.]+\/)|(?:\/)|(?=#))(?!\/)/g
const CAPTURE_REGEX = /((href|src|srcset|codebase|cite|background|cite|action|profile|formaction|icon|manifest|archive)=["'])((([.]+\/)|(?:\/?)|(?:#))(?!\/|http|data)[a-zA-Z0-9._-|/]+)/g

type UrlFunction = (url: string, prop: string) => string

const iterate = (html: string, iterator: UrlFunction) => {
    return html.replace(CAPTURE_REGEX, (full, prefix, prop, url) => {
        return prefix + iterator(url, prop)
    })
}

const absolutify = (html: string, url: UrlFunction | string) => {
    if (typeof url === 'function') return iterate(html, url)
    return html.replace(REPLACE_REGEX, '$1' + url + '/$4')
}

const isValidUrl = (url: string) => {
    try {
        const test = new URL(url)
        return !!test
    } catch (e) {
        return false
    }
}

export const absolutifyUrl = (url: string, origin: string) => {
    const trimmed = url.includes('\n') ? url.substr(0, url.indexOf('\n')) : url
    try {
        const parsedUrl = new URL(trimmed)
        return parsedUrl.href
    } catch (e) {
        if (!trimmed.startsWith('/')) return origin + '/' + trimmed
        return trimmed.replace(/^[^/]+\/[^/].*$|^\/[^/].*$/, origin + trimmed)
    }
}

export const absolutifyHtml = (
    html: string,
    url: string,
    proxyEndpoint: string = ''
) => {
    const origin = new URL(url).origin
    const cssImportRegex = /url\("?([/][^/].*?)"?\)/gm

    return absolutify(html, (url: string) => {
        if (isValidUrl(url)) {
            return proxyEndpoint + url
        }

        return proxyEndpoint !== ''
            ? proxyEndpoint + encodeURIComponent(absolutifyUrl(url, origin))
            : absolutifyUrl(url, origin)
    }).replace(
        cssImportRegex,
        (m: any, $1: string) =>
            `url(${proxyEndpoint + encodeURIComponent(origin + $1)})`
    )
}

export default absolutify
