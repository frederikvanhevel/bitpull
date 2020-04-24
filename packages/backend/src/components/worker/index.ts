import { join } from 'path'
import { fork, ChildProcess } from 'child_process'
import treekill from 'tree-kill'
import { RunnerTimeoutReachedError } from 'utils/errors'
import { Handler, WorkerArgs, WorkerEvent } from './typedefs'
import Logger from 'utils/logging/logger'

const TIMEOUT = Number(process.env.RUNNER_TIMEOUT || 900000)

export enum Work {
    WORKFLOW = 'workflow.ts',
    SINGLE_NODE = 'single-node.ts'
}

const kill = (proc: ChildProcess) => {
    if (!proc) return
    treekill(proc.pid)
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
                Logger.info(`Worker timeout reached`)
                reject(new RunnerTimeoutReachedError())
                kill(forked)
            }, TIMEOUT)

            forked = fork(join(__dirname, './work', work), [
                '-r',
                'ts-node/register'
            ])

            forked.on('message', message => {
                // @ts-ignore
                if (message.data?.error) console.log(message.data?.error)

                if ((message as any).event === WorkerEvent.FINISHED) {
                    Logger.info('Worker finished, stopping.')
                    clearTimeout(timeout)
                    resolve((message as any).data)
                    kill(forked)
                } else onEvent && onEvent(message)
            })

            forked.on('error', error => {  
                clearTimeout(timeout)
                throw error
            })

            forked.on('exit', code => {
                Logger.info(`Worker exited with exit code ${code}`)
                code === 0 ? resolve() : reject()
                kill(forked)
            })

            // forked.on('close', () => resolve())

            forked.send(args)

            onEvent &&
                onEvent({
                    event: WorkerEvent.CREATED,
                    data: forked
                })
        } catch (error) {
            Logger.error(new Error(`Worker error occured`), error)
            reject(error)
            kill(forked)
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
    runSingleNode,
    kill
}

export default Worker
