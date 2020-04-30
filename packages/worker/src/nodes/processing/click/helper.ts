import { Page } from 'puppeteer'
import { clamp } from '../../../utils/common'

const MIN_DELAY = 1
const MAX_DELAY = 60

export const wait = async (
    page: Page,
    delay: number,
    waitForNavigation?: boolean
) => {
    if (waitForNavigation) await page.waitForNavigation()
    else {
        const ms = clamp(MIN_DELAY + delay, MIN_DELAY, MAX_DELAY) * 1000
        await page.waitFor(ms)
    }
}
