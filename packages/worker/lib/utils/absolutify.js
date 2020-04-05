"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const REPLACE_REGEX = /((href|src|srcset|codebase|cite|background|cite|action|profile|formaction|icon|manifest|archive)=["'])(([.]+\/)|(?:\/)|(?=#))(?!\/)/g;
const CAPTURE_REGEX = /((href|src|srcset|codebase|cite|background|cite|action|profile|formaction|icon|manifest|archive)=["'])((([.]+\/)|(?:\/)|(?:#))(?!\/)[a-zA-Z0-9._-]+)/g;
const iterate = (html, iterator) => {
    return html.replace(CAPTURE_REGEX, (full, prefix, prop, url) => {
        return prefix + iterator(url, prop);
    });
};
exports.default = (html, url) => {
    if (typeof url === 'function')
        return iterate(html, url);
    return html.replace(REPLACE_REGEX, '$1' + url + '/$4');
};
exports.absolutifyUrl = (url, origin) => {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.href;
    }
    catch (e) {
        if (!url.startsWith('/')) {
            return origin + '/' + url;
        }
        return url.replace(/^[^/]+\/[^/].*$|^\/[^/].*$/, origin + url);
    }
};
