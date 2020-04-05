import request from 'request'
import { Router } from 'express'

const apiRouter = Router()

apiRouter.get('/proxy', async (req, res) => {
    const { url } = req.query

    try {
        req.pipe(
            request(url).on('error', () => {
                res.status(400).send()
            })
        ).pipe(res)
    } catch (error) {
        res.status(200).send()
    }
})

export default apiRouter
