import assert from 'assert'
import cheerio from 'cheerio'
import { Page } from 'puppeteer'
import { NodeInput } from '../../typedefs/node'
import { Settings } from '../../typedefs/common'
import { getUriOrigin } from '../../utils/common'
import { absolutifyUrl } from '../../utils/absolutify'
import { FlowError } from '../../utils/errors'
import { ParseError } from '../common/errors'
import { CollectNode } from './collect/typedefs'
import { HtmlParseResult } from './html/typedefs'

export interface HTMLSelector {
    value: string
    attribute?: string
}

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

export const getFieldFromPage = async (
    page: Page,
    selector: HTMLSelector,
    url?: string,
    xmlMode: boolean = false
) => {
    const html = await page!.content()
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

export const getFieldsFromHtml = async (
    input: NodeInput<CollectNode, any, HtmlParseResult>,
    settings: Settings,
    xmlMode: boolean = false
) => {
    const { node, page, rootAncestor } = input

    assert(!!page, new FlowError(ParseError.PAGE_MISSING))

    const html = await page!.content()

    const $ = cheerio.load(html, { xmlMode })
    const arrayMapping: Result[] = []

    node.fields.forEach(field => {
        $(field.selector.value).each((i: number, element: CheerioElement) => {
            // only collect as many items as the limit if its set
            if (node.limit && i >= node.limit) return

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

            if (
                trimmedVal &&
                rootAncestor?.parsedLink &&
                field.selector.attribute === 'href'
            ) {
                const origin = getUriOrigin(rootAncestor.parsedLink)
                trimmedVal = absolutifyUrl(trimmedVal, origin)
            }

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
