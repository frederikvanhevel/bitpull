import { NodeError, ParseError } from '../../common/errors'
import { NodeParser, TraverseOptions } from '../../../typedefs/node'
import { assert, clamp } from '../../../utils/common'
import { HtmlParseResult } from '../html/typedefs'
import {
    decrypt,
    isEncryptionVersionSupported
} from '../../../utils/encryption'
import { LoginNode } from './typedefs'
import { LoginError } from './errors'

const DEFAULT_DELAY = 1000
const MAX_DELAY = 60000

const getDecryptedValue = (value: string, options: TraverseOptions) => {
    const { encryption } = options.settings

    assert(encryption && encryption.key, LoginError.ENCRYPTION_KEY_MISSING)
    assert(
        isEncryptionVersionSupported(encryption.version),
        LoginError.ENCRYPTION_VERSION_UNSUPPORTED
    )

    return decrypt(encryption.key, value, encryption.version)
}

const login: NodeParser<LoginNode, undefined, HtmlParseResult> = async (
    input,
    options,
    context
) => {
    const { onLog, settings } = options
    const { browser } = context
    const { node, rootAncestor, page } = input
    const { credentials, delay = DEFAULT_DELAY, waitForNavigation } = node

    assert(credentials, LoginError.CREDENTIALS_MISSING)

    const { username, password, submit } = credentials

    assert(rootAncestor, NodeError.NEEDS_ROOT_ANCESTOR)
    assert(rootAncestor.parsedLink, ParseError.LINK_MISSING)
    assert(username && username.value, LoginError.CREDENTIALS_MISSING)
    assert(username && username.selector, ParseError.SELECTOR_MISSING)
    assert(password && password.value, LoginError.CREDENTIALS_MISSING)
    assert(password && password.selector, ParseError.SELECTOR_MISSING)
    // TODO assert values!
    assert(submit, ParseError.SELECTOR_MISSING)

    const usernameInput = username.encrypted
        ? getDecryptedValue(username.value, options)
        : username.value
    const passwordInput = password.encrypted
        ? getDecryptedValue(password.value, options)
        : password.value

    try {
        await browser.with(
            async page => {
                if (waitForNavigation) await page.waitForNavigation()
                else await page.waitFor(clamp(delay, 0, MAX_DELAY))

                await page.waitFor(username.selector, { visible: true })

                await page.waitFor(120)

                await page.type(username.selector, usernameInput)

                await page.waitFor(232)

                await page.type(password.selector, passwordInput)

                await page.waitFor(112)

                await page.click(submit)
            },
            settings,
            page
        )
    } catch (error) {
        throw new Error(LoginError.COULD_NOT_LOGIN)
    }

    if (onLog) onLog(node, 'Logged in')

    return input
}

export default login
