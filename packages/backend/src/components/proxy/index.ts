import { absolutifyHtml, FlowNode } from '@bitpull/worker'
import Logger from 'utils/logging/logger'
import Worker from 'components/worker'
import { addSelectorScript } from './helper'

const prepareForSelector = async (node: FlowNode) => {
    const proxy = `${process.env.API_URL}/api/proxy?url=`
    const result = await Worker.runSingleNode({
        node,
        options: {
            settings: {
                puppeteer: {
                    endpoint: process.env.PUPPETEER_ENDPOINT!
                },
                proxyEndpoint: proxy,
                encryption: {
                    version: 'v1',
                    key: process.env.ENCRYPTION_KEY!
                },
                exitOnError: true
            }
        }
    })

    let parentResult
    if (Array.isArray(result)) {
        parentResult = result.flat(Infinity)[0].parentResult
    } else {
        parentResult = result.parentResult
    }

    if (!parentResult) {
        Logger.throw(new Error(`Could not get website content`))
    }

    const absolute = absolutifyHtml(parentResult.html, parentResult.url, proxy)

    return addSelectorScript(absolute)
}

const ProxyTool = {
    prepareForSelector
}

export default ProxyTool
