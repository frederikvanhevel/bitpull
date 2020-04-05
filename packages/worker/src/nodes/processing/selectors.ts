import assert from 'assert'
import cheerio from 'cheerio'
import { NodeInput, FlowNode, NodeType } from '../../typedefs/node'
import { Settings } from '../../typedefs/common'
import { getUriOrigin } from '../../utils/common'
import { absolutifyUrl } from '../../utils/absolutify'
import { CollectNode } from './collect/typedefs'
import { HtmlParseResult } from './html/typedefs'

export interface HTMLSelector {
    value: string
    attribute?: string
}

const HTML_MISSING = 'HTML_MISSING'

enum ATTRIBUTE_TO_ELEMENT_MAP {
    href = 'a',
    src = 'img'
}

type Result = Record<string, string | number>

function isNumeric(num: string) {
    // @ts-ignore
    return !isNaN(num)
}

function isValidAttribute(
    attribute: string
): attribute is keyof typeof ATTRIBUTE_TO_ELEMENT_MAP {
    return attribute in ATTRIBUTE_TO_ELEMENT_MAP
}

export const getFieldFromHtml = (
    html: string,
    selector: HTMLSelector,
    url?: string,
    xmlMode: boolean = false
) => {
    const $ = cheerio.load(html, { xmlMode })
    let result =
        selector.attribute && selector.attribute !== 'text'
            ? $(selector.value).attr(selector.attribute)
            : $(selector.value).text()

    // convert relative to absolute urls
    if (url && result && selector.attribute === 'href') {
        const origin = getUriOrigin(url)
        result = absolutifyUrl(result, origin)
    }

    return result
}

export const getFieldsFromHtml = (
    input: NodeInput<CollectNode, any, HtmlParseResult>,
    settings: Settings,
    xmlMode: boolean = false
) => {
    const { node, parentResult } = input

    assert(parentResult!.html, HTML_MISSING)

    const $ = cheerio.load(parentResult!.html, { xmlMode })
    const arrayMapping: Result[] = []

    node.fields.forEach(field => {
        $(field.selector.value).each((i: number, element: CheerioElement) => {
            let el = $(element)
            const tagName = el[0].name

            // see if we can find the element with attribute as a child
            if (
                field.selector.attribute &&
                isValidAttribute(field.selector.attribute) &&
                (ATTRIBUTE_TO_ELEMENT_MAP as any)[field.selector.attribute] !==
                    tagName
            ) {
                el =
                    el.closest(
                        ATTRIBUTE_TO_ELEMENT_MAP[field.selector.attribute]
                    ) || el
            }

            const val =
                field.selector.attribute &&
                field.selector.attribute !== '' &&
                field.selector.attribute !== 'text'
                    ? el.attr(field.selector.attribute)
                    : el.text()

            let trimmedVal = val ? val.trim().replace(/[\r\n]( +)/, '') : val

            // remove proxy url and decode if its a link
            if (
                trimmedVal &&
                settings.proxyEndpoint &&
                field.selector.attribute === 'href'
            ) {
                const url = trimmedVal.replace(settings.proxyEndpoint, '')
                trimmedVal = decodeURIComponent(url)
            }

            // TODO check if link with proxy url prefixed
            // if so then remove and decode

            arrayMapping[i] = {
                ...arrayMapping[i],
                ...{
                    [field.label]: isNumeric(val!)
                        ? parseInt(trimmedVal!, 10)
                        : trimmedVal!
                }
            }
        })
    })

    return arrayMapping.length === 1 ? arrayMapping[0] : arrayMapping
}

export const getFieldFromXml = (
    html: string,
    field: HTMLSelector,
    url?: string
) => {
    return getFieldFromHtml(html, field, url, true)
}

export const getFieldsFromXml = (
    input: NodeInput<CollectNode>,
    settings: Settings
) => {
    return getFieldsFromHtml(input, settings, true)
}

export const getSelectorParser = (node: FlowNode) => {
    if (node.type === NodeType.HTML) {
        return getFieldFromHtml
    } else if (node.type === NodeType.XML) {
        return getFieldFromXml
    }

    return null
}
