import request from 'request'
import { Router } from 'express'
import StorageService from 'services/storage'
import { User } from 'models/user'

const LOCALHOST_REGEX = /https?:\/\/localhost/
const apiRouter = Router()

apiRouter.get('/proxy', async (req, res) => {
    const { url } = req.query

    if (!req.user) {
        return res.status(401).send({ status: 'Unauthenticated' })
    }

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

apiRouter.get('/storage/:id', async (req, res) => {
    const { id } = req.params
    const entry = await StorageService.getStorageLink(id)

    try {
        req.pipe(
            request(entry.url).on('error', () => {
                res.status(400).send()
            })
        )
            .on('response', () => {
                res.setHeader(
                    'Content-Disposition',
                    `attachment; filename="${entry.fileName}"`
                )
            })
            .pipe(res)
    } catch (error) {
        res.status(400).send()
    }
})

export default apiRouter
