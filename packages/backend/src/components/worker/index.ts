import { join } from 'path'
import { fork, ChildProcess } from 'child_process'
import { RunnerTimeoutReachedError } from 'utils/errors'
import { Handler, WorkerArgs, WorkerEvent } from './typedefs'

const TIMEOUT = Number(process.env.RUNNER_TIMEOUT || 900000)

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
                reject(new RunnerTimeoutReachedError())
            }, TIMEOUT)

            forked = fork(join(__dirname, './work', work), [
                '-r',
                'ts-node/register'
            ])

            forked.on('message', message => {
                if ((message as any).event === WorkerEvent.FINISHED) {
                    clearTimeout(timeout)
                    resolve((message as any).data)
                } else onEvent && onEvent(message)
            })

            forked.on('error', () => {
                clearTimeout(timeout)
                reject()
            })

            forked.on('exit', (code) => {
                code === 0 ? resolve() : reject()
            })

            // forked.on('close', () => resolve())

            forked.send(args)

            onEvent &&
                onEvent({
                    event: WorkerEvent.CREATED,
                    data: forked
                })
        } catch (error) {
            reject(error)
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
