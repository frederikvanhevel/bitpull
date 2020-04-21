import { Page } from 'puppeteer-core'
import { FlowError } from '../../../utils/errors'
import { NodeError } from '../../common/errors'
import { NodeParser, NodeInput } from '../../../typedefs/node'
import { assert } from '../../../utils/common'
import { randomizedDelay } from '../../../utils/delay'
import { ScrollNode } from './typedefs'
import { ScrollError } from './errors'

const scroll: NodeParser<ScrollNode> = async (
    input: NodeInput<ScrollNode>,
    options,
    context
) => {
    const { settings, onLog } = options
    const { browser } = context
    const { node, rootAncestor, page } = input

    assert(rootAncestor, NodeError.NEEDS_ROOT_ANCESTOR)

    try {
        await browser.with(
            async (page: Page) => {
                // page.$eval('#element', (el) => el.scrollIntoView())

                // Get the height of the rendered page
                const bodyHandle = await page.$('body')

                if (!bodyHandle) return

                const boundingBox = await bodyHandle.boundingBox()

                if (!boundingBox) return

                await bodyHandle.dispose()

                // Scroll one viewport at a time, pausing to let content load
                const viewportHeight = page.viewport().height
                let viewportIncr = 0
                while (viewportIncr + viewportHeight < boundingBox.height) {
                    // eslint-disable-next-line
                    await page.evaluate((height: number) => {
                        // eslint-disable-next-line
                        window.scrollBy(0, height)
                    }, viewportHeight)

                    await randomizedDelay(400, 1000)

                    viewportIncr += viewportHeight
                }

                // Scroll back to top
                await page.evaluate(() => {
                    // eslint-disable-next-line
                    window.scrollTo(0, 0)
                })
            },
            settings,
            page
        )
    } catch (error) {
        throw new FlowError(ScrollError.COULD_NOT_SCROLL)
    }

    if (onLog) onLog(node, 'Clicked element')

    return Promise.resolve(input)
}

export default scroll
