import { HtmlNode, NodeType, absolutifyHtml } from '@bitpull/worker'
import Logger from 'utils/logging/logger'
import Worker from 'components/worker'
import { addSelectorScript } from './helper'

const prepareForSelector = async (url: string, delay: number = 0) => {
    const node: HtmlNode = {
        id: '00',
        type: NodeType.HTML,
        link: url,
        parseJavascript: true,
        delay
    }

    const { parentResult } = await Worker.runSingleNode({
        node,
        options: {
            settings: {
                puppeteer: {
                    endpoint: process.env.PUPPETEER_ENDPOINT!
                }
            }
        }
    })

    const proxy = `${process.env.API_URL}/api/proxy?url=`

    if (!parentResult) {
        Logger.throw(new Error(`Could not get website content for ${url}`))
    }

    const absolute = absolutifyHtml(parentResult.html, parentResult.url, proxy)

    return addSelectorScript(absolute)
}

const ProxyTool = {
    prepareForSelector
}

export default ProxyTool
