import Traverser from '@bitpull/worker'
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

        process.send!({
            event: WorkerEvent.FINISHED,
            data: {
                html: await page.content(),
                url: await page.url()
            }
        })

        await traverser.cleanup()
    } catch (error) {
        console.log(error)
        await traverser.cleanup()
        process.exit(1)
    }
})

const cleanup = async () => {
    await traverser.cleanup()
}

process.on('SIGINT', cleanup)
process.on('exit', cleanup)
