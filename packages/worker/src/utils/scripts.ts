import { Page } from 'puppeteer'

export const stripScriptTags = async (page: Page) => {
    await page.evaluate(`
        var r = document.getElementsByTagName('script');
        for (var i = (r.length - 1); i >= 0; i--) {
            if (r[i].getAttribute('id') != 'a') {
                r[i].parentNode.removeChild(r[i]);
            }
        }
    `)
}

export const removeAttribute = async (
    page: Page,
    tag: string,
    attr: string
) => {
    await page.evaluate(`
        var r = document.getElementsByTagName('${tag}');
        for (var i = (r.length - 1); i >= 0; i--) {
            if (r[i].getAttribute('${attr}')) {
                r[i].removeAttribute('${attr}');
            }
        }
    `)
}

export const scrollToBottom = async (
    page: Page,
    scrollStep: number = 250,
    scrollDelay: number = 100
) => {
    const lastPosition = await page.evaluate(
        async (step, delay) => {
            const getScrollHeight = (element: HTMLElement) => {
                const { scrollHeight, offsetHeight, clientHeight } = element
                return Math.max(scrollHeight, offsetHeight, clientHeight)
            }

            const position = await new Promise(resolve => {
                let count = 0
                const intervalId = setInterval(() => {
                    const { body } = document // eslint-disable-line
                    const availableScrollHeight = getScrollHeight(body)

                    window.scrollBy(0, step) // eslint-disable-line
                    count += step

                    if (count >= availableScrollHeight) {
                        clearInterval(intervalId)
                        resolve(count)
                    }
                }, delay)
            })

            return position
        },
        scrollStep,
        scrollDelay
    )

    return lastPosition
}
