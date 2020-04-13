import { resolve as resolveUrl } from 'url'
import delay from 'delay'
import got from 'got'
import { serializeError } from 'serialize-error'
import { createLightship } from 'lightship'
import dotenv from 'dotenv'
import { ChromePressure } from 'typedefs'
dotenv.config()

const lightship = createLightship()

const PUPPETEER_URL = process.env.PUPPETEER_URL
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL || '1', 10)
const MAXIMUM_QUEUE_SIZE = parseInt(process.env.MAXIMUM_QUEUE_SIZE || '10')

const main = async () => {
    if (!PUPPETEER_URL) {
        throw new Error('Puppeteer url missing')
    }

    while (true) {
        const pressureApiUrl = resolveUrl(PUPPETEER_URL, '/pressure')

        console.trace('running readiness probe')

        let response: any

        try {
            response = await got(pressureApiUrl).json()
        } catch (error) {
            console.error(
                {
                    error: serializeError(error)
                },
                'cannot get the latest pressure metrics; signaling that instance is not ready'
            )

            lightship.signalNotReady()
        }

        if (response) {
            const pressure: ChromePressure = response.pressure

            console.trace(
                {
                    pressure
                },
                'received new pressure report'
            )

            if (pressure.isAvailable !== true) {
                console.warn(
                    'pressure API indicates that instance is not ready; signaling that instance is not ready'
                )

                lightship.signalNotReady()
            } else if (pressure.queued >= MAXIMUM_QUEUE_SIZE) {
                console.warn(
                    'pressure API reported queue size is equal or greater than the maximum desired queue size; signaling that instance is not ready'
                )

                lightship.signalNotReady()
            } else {
                console.info(
                    'instance is ready and can handle more requests; signaling that instance is ready'
                )

                lightship.signalReady()
            }
        }

        await delay(CHECK_INTERVAL * 1000)
    }
}

main()
