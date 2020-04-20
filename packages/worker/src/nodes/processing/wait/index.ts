import { NodeParser, NodeInput } from '../../../typedefs/node'
import { NodeError } from '../../common/errors'
import { assert, clamp } from '../../../utils/common'
import { WaitNode } from './typedefs'

const DEFAULT_DELAY = 5
const MIN_DELAY = 0
const MAX_DELAY = 600

const wait: NodeParser<WaitNode> = async (
    input: NodeInput<WaitNode>,
    options,
    context
) => {
    const { settings, onLog } = options
    const { browser } = context
    const { node, rootAncestor, page } = input
    const { delay = DEFAULT_DELAY } = node

    assert(rootAncestor, NodeError.NEEDS_ROOT_ANCESTOR)

    const ms = clamp(MIN_DELAY + delay, MIN_DELAY, MAX_DELAY) * 1000

    await browser.with(
        async page => {
            await page.waitFor(ms)
        },
        settings,
        page
    )

    if (onLog) onLog(node, `Waited for ${ms / 1000} seconds`)

    return Promise.resolve(input)
}

export default wait
