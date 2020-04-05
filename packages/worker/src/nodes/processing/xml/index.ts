import { parseXml } from '../../../utils/file'
import { NodeParser } from '../../../typedefs/node'
import { assert, getUriOrigin, request } from '../../../utils/common'
import { NodeError, ParseError } from '../../common/errors'
import { XmlNode } from './typedefs'

const xml: NodeParser<XmlNode> = async (input, options) => {
    const { onLog } = options
    const { node, parentResult, rootAncestor } = input

    let { link } = node
    if (node.linkedField) {
        assert(rootAncestor, NodeError.NEEDS_ROOT_ANCESTOR)
        link =
            getUriOrigin(rootAncestor!.link!) + parentResult[node.linkedField]
    }

    assert(link, ParseError.LINK_MISSING)

    const body = await request(link!)
    // TODO we don't actually need xmlToJson here and should just use
    // cheerio selectors
    const json = await parseXml(body)

    if (onLog) onLog(node, `Got xml content of ${link}`)

    return Promise.resolve({
        ...input,
        parentResult: json
    })
}

export default xml
