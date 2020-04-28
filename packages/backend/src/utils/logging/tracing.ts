// TODO use AsyncLocalStorage instead once node 13 has LTS
import { createNamespace } from 'cls-hooked'
import { v4 as uuidv4 } from 'uuid'
import { Request, Response } from 'express'

const SESSION_NAME = 'backend'
const TRACE_ID_KEY = 'traceId'
const TRACE_ID_HEADER = 'x-trace-id'

const store = createNamespace(SESSION_NAME)

const withId = (fn: Function, id?: string) => {
    store.run(() => {
        store.set(TRACE_ID_KEY, id || uuidv4())
        fn()
    })
}

export const getTraceId = () => {
    return store.get(TRACE_ID_KEY)
}

export const tracingMiddleware = async (
    req: Request,
    res: Response,
    next: Function
) => {
    store.bindEmitter(req)
    store.bindEmitter(res)
    store.bindEmitter(req.socket)

    withId(() => {
        next()
    }, req.get(TRACE_ID_HEADER))

    // await new Promise((resolve, reject) => {
    //     withId(() => {
    //         next(req.res, next)
    //     }, req.get(TRACE_ID_HEADER))
    // })
}
