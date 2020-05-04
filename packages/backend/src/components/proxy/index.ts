import { absolutifyHtml, FlowNode } from '@bitpull/worker'
import Logger from 'utils/logging/logger'
import Worker from 'components/worker'
import Config from 'utils/config'
import { addSelectorScript } from './helper'

const prepareForSelector = async (node: FlowNode) => {
    const proxy = `${Config.API_URL}/api/proxy?url=`
    const result = await Worker.runSingleNode({
        node,
        options: {
            settings: {
                puppeteer: {
                    endpoint: Config.PUPPETEER_ENDPOINT
                },
                proxyEndpoint: proxy,
                encryption: {
                    version: 'v1',
                    key: Config.ENCRYPTION_KEY
                },
                exitOnError: true
            }
        }
    })

    if (!result) {
        Logger.throw(
            new Error(`Could not get website content`),
            new Error(JSON.stringify(result))
        )
    }

    const absolute = absolutifyHtml(result.html, result.url, proxy)

    return addSelectorScript(absolute)
}

const ProxyTool = {
    prepareForSelector
}

export default ProxyTool
