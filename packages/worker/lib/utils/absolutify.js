"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.absolutifyHtml = exports.absolutifyUrl = void 0;
const REPLACE_REGEX = /((href|src|srcset|codebase|cite|background|cite|action|profile|formaction|icon|manifest|archive)=["'])(([.]+\/)|(?:\/)|(?=#))(?!\/)/g;
const CAPTURE_REGEX = /((href|src|srcset|codebase|cite|background|cite|action|profile|formaction|icon|manifest|archive)=["'])((([.]+\/)|(?:\/?)|(?:#))(?!\/|http|data)[a-zA-Z0-9._-|/]+)/g;
const iterate = (html, iterator) => {
    return html.replace(CAPTURE_REGEX, (full, prefix, prop, url) => {
        return prefix + iterator(url, prop);
    });
};
const absolutify = (html, url) => {
    if (typeof url === 'function')
        return iterate(html, url);
    return html.replace(REPLACE_REGEX, '$1' + url + '/$4');
};
const isValidUrl = (url) => {
    try {
        const test = new URL(url);
        return !!test;
    }
    catch (e) {
        return false;
    }
};
exports.absolutifyUrl = (url, origin) => {
    const trimmed = url.includes('\n') ? url.substr(0, url.indexOf('\n')) : url;
    try {
        const parsedUrl = new URL(trimmed);
        return parsedUrl.href;
    }
    catch (e) {
        if (!trimmed.startsWith('/'))
            return origin + '/' + trimmed;
        return trimmed.replace(/^[^/]+\/[^/].*$|^\/[^/].*$/, origin + trimmed);
    }
};
exports.absolutifyHtml = (html, url, proxyEndpoint = '') => {
    const origin = new URL(url).origin;
    const cssImportRegex = /url\("?([/][^/].*?)"?\)/gm;
    return absolutify(html, (url) => {
        if (isValidUrl(url)) {
            return proxyEndpoint + url;
        }
        return proxyEndpoint !== ''
            ? proxyEndpoint + encodeURIComponent(exports.absolutifyUrl(url, origin))
            : exports.absolutifyUrl(url, origin);
    }).replace(cssImportRegex, (m, $1) => `url(${proxyEndpoint + encodeURIComponent(origin + $1)})`);
};
exports.default = absolutify;
//# sourceMappingURL=absolutify.js.map