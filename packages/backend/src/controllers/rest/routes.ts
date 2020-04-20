import request from 'request'
import { Router } from 'express'

const LOCALHOST_REGEX = /https?:\/\/localhost/
const apiRouter = Router()

apiRouter.get('/proxy', async (req, res) => {
    const { url } = req.query

    // prevent localhost
    if (typeof url !== 'string' || LOCALHOST_REGEX.test(url)) {
        res.status(400).send()
    }

    try {
        req.pipe(
            request(url as string).on('error', () => {
                res.status(400).send()
            })
        ).pipe(res)
    } catch (error) {
        res.status(200).send()
    }
})

export default apiRouter
