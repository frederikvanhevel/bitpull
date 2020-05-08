import Traverser from '@bitpull/worker'
import { NodeEventType } from 'services/workflow/typedefs'
import { WorkerArgs, WorkerEvent } from '../typedefs'

let traverser: Traverser

process.on('message', async (args: WorkerArgs) => {
    traverser = new Traverser({
        ...args.options,
        onStart: node => {
            process.send!({
                event: NodeEventType.START,
                data: {
                    nodeId: node.id,
                    nodeType: node.type
                }
            })
        },
        onError: (node, error) => {
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
            process.send!({
                event: NodeEventType.COMPLETE,
                data: {
                    nodeId: node.id,
                    nodeType: node.type
                }
            })
        },
        onWatch: result => {
            process.send!({
                event: NodeEventType.WATCH,
                data: {
                    result
                }
            })
        },
        onStorage: data => {
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
process.on('unhandledRejection', reason => {
    process.exit(1)
})
