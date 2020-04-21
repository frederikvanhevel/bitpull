import { Response } from 'request'
import requestRetry from 'request-promise-native'
import { NodeError } from '../nodes/common/errors'
import { FlowError } from './errors'

const REQUEST_MAX_RETRIES = 10
const REQUEST_TIMEOUT = 120000

export const request = async (
    url: string,
    retries: number = 0
): Promise<any> => {
    try {
        const response: Response = await requestRetry({
            uri: url,
            timeout: REQUEST_TIMEOUT,
            resolveWithFullResponse: true
        })

        return response.body
    } catch (error) {
        if (error.statusCode === 404) {
            return null
        }

        if (retries < REQUEST_MAX_RETRIES) {
            // console.error(`${url} - retrying ... (${retries + 1})`);
            return await request(url, ++retries)
        }

        throw new Error(`${url} - failed after ${REQUEST_MAX_RETRIES} retries`)
    }
}

export const getUriOrigin = (uri: string): string => {
    const url = new URL(uri)
    return url.origin
}

export function assert(
    condition: any,
    errorCode: string = NodeError.UNKNOWN_ERROR
): asserts condition {
    if (!condition) throw new FlowError(errorCode)
}

export const isTestEnv = () => process.env.NODE_ENV === 'test'

export const clamp = (number: number, min: number, max: number) => {
    return Math.min(Math.max(number, min), max)
}

export const sequentialPromise = async (data: any[], executor: (data: any) => Promise<any>) => {
    return data.reduce((p, next) => {
        return p.then(async () => await executor(next))
    }, Promise.resolve());
}