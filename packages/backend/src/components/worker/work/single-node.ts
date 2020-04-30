import Traverser from '@bitpull/worker'
import { stripScriptTags } from '@bitpull/worker/src/utils/scripts'
import Logger from 'utils/logging/logger'
import { WorkerArgs, WorkerEvent } from '../typedefs'

let traverser: Traverser

process.on('message', async (args: WorkerArgs) => {
    traverser = new Traverser({
        ...args.options
    })

    try {
        const result = await traverser.parseNode({ node: args.node })

        let page
        if (Array.isArray(result)) {
            page = result.flat(Infinity)[0]?.page
        } else {
            page = result.page
        }

        await stripScriptTags(page)

        process.send!({
            event: WorkerEvent.FINISHED,
            data: {
                html: await page.content(),
                url: await page.url()
            }
        })

        await traverser.cleanup()
    } catch (error) {
        Logger.error(new Error('Error happened in single node worker'), error)
        await traverser.cleanup()
        // eslint-disable-next-line no-process-exit
        process.exit(1)
    }
})

const cleanup = async () => {
    await traverser.cleanup()
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
process.on('exit', cleanup)
