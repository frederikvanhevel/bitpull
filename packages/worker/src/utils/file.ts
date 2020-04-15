import fs from 'fs'
import tmp from 'tmp'
import { Parser } from 'xml2js'
import { AsyncParser } from 'json2csv'
import { ParseError } from '../nodes/common/errors'
import { FlowError } from './errors'

// cleanup files even on uncaught exceptions
tmp.setGracefulCleanup()

// TODO add to settings
const FILE_PREFIX = 'nf-'
const CSV_OPTIONS = { highWaterMark: 8192 }

export enum FileType {
    JSON = 'json',
    EXCEL = 'xlsx',
    CSV = 'csv',
    PDF = 'pdf',
    PNG = 'png'
}

export enum FileEncoding {
    UTF8 = 'utf8',
    BINARY = 'binary',
    BASE64 = 'base64'
}

export interface FileWriteResult {
    path: string
    fileName: string
    encoding?: FileEncoding
    contentType: string
}

export const writeFile = (
    content: any,
    type: FileType,
    encoding: FileEncoding = FileEncoding.UTF8
): Promise<string> => {
    return new Promise((resolve, reject) => {
        tmp.file({ prefix: FILE_PREFIX, postfix: `.${type}` }, (err, path) => {
            if (err) reject(err)

            fs.writeFile(path, content, encoding, error => {
                if (error) reject(error)
                else resolve(path)
            })
        })
    })
}

export const readFile = async (path: string, encoding: FileEncoding) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, { encoding }, (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}

export const validateFilePath = (path: string): boolean => {
    return /^(\/[\w^ ]+)+\/$/.test(path)
}

export const getFileNameFromPath = (path: string): string => {
    const match = path.match(/[^/]+$/)

    if (!match || !match.length) {
        throw new Error("Can't find filename from path")
    }

    return match[0]
}

export const parseXml = async (body: string) => {
    const { parseStringPromise } = new Parser({ explicitArray: false })

    try {
        return await parseStringPromise(body)
    } catch (error) {
        throw new FlowError(ParseError.XML_PARSE_ERROR)
    }
}

export const convertToCsv = async (data: object[]) => {
    return new Promise((resolve, reject) => {
        const asyncParser = new AsyncParser({}, CSV_OPTIONS)
        const buffer = Buffer.from(JSON.stringify(data))

        let csv = ''
        asyncParser.processor
            .on('data', chunk => (csv += chunk.toString()))
            .on('end', () => resolve(csv))
            .on('error', err => reject(err))

        asyncParser.input.push(buffer)
        asyncParser.input.push(null)
    })
}
