import { join } from 'path'
import { fork, ChildProcess } from 'child_process'
import { Handler, WorkerArgs, WorkerEvent } from './typedefs'

const TIMEOUT = Number(process.env.RUNNER_TIMEOUT)

export enum Work {
    WORKFLOW = 'workflow.ts',
    SINGLE_NODE = 'single-node.ts'
}

const spawn = (
    work: Work,
    args: WorkerArgs,
    onEvent?: (...args: any[]) => void
): Promise<any> => {
    let timeout: NodeJS.Timeout
    let forked: ChildProcess

    return new Promise((resolve, reject) => {
        try {
            timeout = setTimeout(() => {
                if (forked) forked.kill()
                reject(new Error('Child process timeout reached'))
            }, TIMEOUT || 900000)

            forked = fork(join(__dirname, './work', work), [
                '-r',
                'ts-node/register'
            ])

            forked.on('message', message => {
                if ((message as any).event === WorkerEvent.FINISHED) {
                    resolve((message as any).data)
                } else onEvent && onEvent(message)
            })

            forked.on('error', reject)

            // forked.on('exit', () => resolve())

            // forked.on('close', () => resolve())

            forked.send(args)

            onEvent &&
                onEvent({
                    event: WorkerEvent.CREATED,
                    data: forked
                })
        } catch (error) {
            reject(error)
        } finally {
            clearTimeout(timeout)
        }
    })
}

const runWorkflow = async (args: WorkerArgs, handler: Handler) => {
    return await spawn(Work.WORKFLOW, args, message => {
        if (!message.event) return
        handler(message.event, message.data)
    })
}

const runSingleNode = async (args: WorkerArgs) => {
    return await spawn(Work.SINGLE_NODE, args)
}

const Worker = {
    spawn,
    runWorkflow,
    runSingleNode
}

export default Worker
