import Traverser from '@bitpull/worker'
import { NodeEventType } from 'services/workflow/typedefs'
import { WorkerArgs, WorkerEvent } from '../typedefs'

let traverser: Traverser

process.on('message', async (args: WorkerArgs) => {
    traverser = new Traverser({
        ...args.options,
        onStart: node => {
            if (!process.connected) return
            process.send!({
                event: NodeEventType.START,
                data: {
                    nodeId: node.id,
                    nodeType: node.type
                }
            })
        },
        onError: (node, error) => {
            if (!process.connected) return
            process.send!({
                event: NodeEventType.ERROR,
                data: {
                    nodeId: node.id,
                    nodeType: node.type,
                    error: error.message,
                    code: error.code
                }
            })
        },
        onComplete: node => {
            if (!process.connected) return
            process.send!({
                event: NodeEventType.COMPLETE,
                data: {
                    nodeId: node.id,
                    nodeType: node.type
                }
            })
        },
        onWatch: result => {
            if (!process.connected) return
            process.send!({
                event: NodeEventType.WATCH,
                data: {
                    result
                }
            })
        },
        onStorage: data => {
            if (!process.connected) return
            process.send!({
                event: NodeEventType.STORAGE,
                data
            })
        }
    })

    try {
        const result = await traverser.run(args.node)

        process.send!({
            event: WorkerEvent.FINISHED,
            data: result
        })


        await traverser.cleanup()
        // eslint-disable-next-line no-process-exit
        // process.exit(0)
    } catch (error) {
        await traverser.cleanup()
        // if (!traverser.canceled) throw error
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
process.on('disconnect', async () => {
    await cleanup()
    // eslint-disable-next-line no-process-exit
    process.exit(0)
})
process.on('unhandledRejection', reason => {
    console.log(reason)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
})
