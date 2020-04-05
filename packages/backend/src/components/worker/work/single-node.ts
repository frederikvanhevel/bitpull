import Traverser from '@bitpull/worker'
import { WorkerArgs, WorkerEvent } from '../typedefs'

let traverser: Traverser

process.on('message', async (args: WorkerArgs) => {
    traverser = new Traverser({
        ...args.options
    })

    try {
        const result = await traverser.parseNode({ node: args.node })

        process.send!({
            event: WorkerEvent.FINISHED,
            data: result
        })

        await traverser.cleanup()
    } catch (error) {
        await traverser.cleanup()
        throw error
    }
})

const cleanup = async () => {
    await traverser.cleanup()
}

process.on('SIGINT', cleanup)
process.on('exit', cleanup)
