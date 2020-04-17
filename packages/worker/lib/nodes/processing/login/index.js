"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../common/errors");
const common_1 = require("../../../utils/common");
const encryption_1 = require("../../../utils/encryption");
const errors_2 = require("./errors");
const DEFAULT_DELAY = 1000;
const MAX_DELAY = 60000;
const getDecryptedValue = (value, options) => {
    const { encryption } = options.settings;
    common_1.assert(encryption && encryption.key, errors_2.LoginError.ENCRYPTION_KEY_MISSING);
    common_1.assert(encryption_1.isEncryptionVersionSupported(encryption.version), errors_2.LoginError.ENCRYPTION_VERSION_UNSUPPORTED);
    return encryption_1.decrypt(encryption.key, value, encryption.version);
};
const login = async (input, options, context) => {
    const { onLog, settings } = options;
    const { browser } = context;
    const { node, rootAncestor } = input;
    const { credentials, delay = DEFAULT_DELAY, waitForNavigation } = node;
    common_1.assert(credentials, errors_2.LoginError.CREDENTIALS_MISSING);
    const { username, password, submit } = credentials;
    common_1.assert(rootAncestor, errors_1.NodeError.NEEDS_ROOT_ANCESTOR);
    common_1.assert(rootAncestor.parseJavascript, errors_1.NodeError.NEEDS_REAL_BROWSER);
    common_1.assert(rootAncestor.parsedLink, errors_1.ParseError.LINK_MISSING);
    common_1.assert(username && username.value, errors_2.LoginError.CREDENTIALS_MISSING);
    common_1.assert(username && username.selector, errors_1.ParseError.SELECTOR_MISSING);
    common_1.assert(password && password.value, errors_2.LoginError.CREDENTIALS_MISSING);
    common_1.assert(password && password.selector, errors_1.ParseError.SELECTOR_MISSING);
    // TODO assert values!
    common_1.assert(submit, errors_1.ParseError.SELECTOR_MISSING);
    const usernameInput = username.encrypted
        ? getDecryptedValue(username.value, options)
        : username.value;
    const passwordInput = password.encrypted
        ? getDecryptedValue(password.value, options)
        : password.value;
    let renderedHtml;
    try {
        await browser.with(async (page) => {
            await page.goto(rootAncestor.parsedLink);
            await page.waitFor(username.selector, { visible: true });
            await page.waitFor(120);
            await page.type(username.selector, usernameInput);
            await page.waitFor(232);
            await page.type(password.selector, passwordInput);
            await page.waitFor(112);
            await page.click(submit);
            if (waitForNavigation)
                await page.waitForNavigation();
            else
                await page.waitFor(common_1.clamp(delay, 0, MAX_DELAY));
            renderedHtml = await page.content();
        }, settings);
    }
    catch (error) {
        throw new Error(errors_2.LoginError.COULD_NOT_LOGIN);
    }
    common_1.assert(renderedHtml, errors_1.ParseError.ERROR_RENDERING_HTML);
    if (onLog)
        onLog(node, 'Logged in');
    return Object.assign(Object.assign({}, input), { parentResult: {
            html: renderedHtml,
            url: rootAncestor.parsedLink
        } });
};
exports.default = login;
//# sourceMappingURL=index.js.map