import assert from 'assert'
import {
    NodeType,
    NodeInput,
    TraverseOptions,
    FlowNode,
    RootNode,
    Context,
    BranchNode
} from './typedefs/node'
import { isRootNode, getModule, isBranchNode } from './utils/helper'
import {
    StorageProvider,
    LogType,
    ParseResult,
    ParseLog,
    StorageObject,
    Status,
    FileStorageObject,
    ErrorLog
} from './typedefs/common'
import CustomBrowser from './browser'
import { NodeError } from './nodes/common/errors'
import { FlowError } from './utils/errors'
import Logger from './utils/logging/logger'

const DEFAULT_OPTIONS: TraverseOptions = {
    integrations: [],
    settings: {
        storage: {
            provider: StorageProvider.NONE
        },
        exitOnError: false,
        maxErrorsBeforeExit: 10
    }
}

class Traverser {
    private options: TraverseOptions
    private context: Context
    private canceled: boolean = false
    private errorCount: number = 0

    constructor(
        options: TraverseOptions = DEFAULT_OPTIONS,
        browser?: CustomBrowser
    ) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options
        }
        this.context = {
            traverser: this,
            browser: browser || new CustomBrowser()
        }

        if (options.settings.traceId) {
            Logger.setTraceId(options.settings.traceId)
        }
    }

    private async getNodeResult(
        input: NodeInput<FlowNode>
    ): Promise<NodeInput<FlowNode>> {
        const { node, branchCallback } = input
        const { onStart, onComplete, onLog } = this.options

        onStart && onStart(node)

        let nodeResult: NodeInput<FlowNode>
        const module = await getModule(node.type)

        if (
            node.type === NodeType.PAGINATION ||
            node.type === NodeType.HTML_MULTIPLE
        ) {
            const branchNode = node as BranchNode
            const branchResult = await module(input, this.options, this.context)
            const endNode = node.children!.find(
                childNode => childNode.id === branchNode.goToOnEnd
            )

            if (endNode) {
                onLog && onLog(node, 'Pagination finished')

                nodeResult = await this.getNodeResult({
                    ...input,
                    node: endNode,
                    passedData: [].concat(...branchResult.passedData)
                })
            } else {
                nodeResult = branchResult
            }
        } else {
            nodeResult = await module(input, this.options, this.context)
        }

        if (!node.children || !node.children.length) {
            // if we are at the end of a pagination tree return the data to it
            if (branchCallback) branchCallback(nodeResult!.passedData)
        }

        onComplete && onComplete(node)

        return nodeResult
    }

    public async parseNode(
        input: NodeInput<FlowNode>
    ): Promise<NodeInput<FlowNode>> {
        const { node: currentNode, rootAncestor } = input
        const { onError, onLog, settings } = this.options

        if (this.canceled) {
            throw new Error('Operation was canceled')
        }

        if (currentNode.disabled) return input

        try {
            const isPrimaryNode = isRootNode(currentNode)
            const nodeResult = await this.getNodeResult({
                ...input
            })

            assert(nodeResult, NodeError.NO_RESULT)

            const { node } = nodeResult

            if (!isBranchNode(node) && node.children?.length) {
                await Promise.all(
                    node.children.map(async child =>
                        this.parseNode({
                            ...input,
                            ...nodeResult,
                            node: child,
                            parent: node,
                            rootAncestor: isPrimaryNode
                                ? (currentNode as RootNode)
                                : rootAncestor
                        }).catch(error => {
                            if (settings.exitOnError) {
                                throw error
                            } else if (onError) {
                                onError(child, error)
                            }
                        })
                    )
                )
            }

            return {
                ...input,
                ...nodeResult
            }
        } catch (error) {
            if (onError) onError(currentNode, error)
            if (onLog) onLog(currentNode, error.message, LogType.ERROR)
            if (settings.exitOnError) throw error
            return input
        }
    }

    public async run(node: FlowNode): Promise<ParseResult> {
        const originalErrorFn = this.options.onError
        const originalLogFn = this.options.onLog
        const originalStorageFn = this.options.onStorage
        const { maxErrorsBeforeExit } = this.options.settings

        const logs: ParseLog[] = []
        const errors: ErrorLog[] = []
        const files: FileStorageObject[] = []

        this.options.onError = (node: FlowNode, error: FlowError) => {
            this.errorCount++

            if (
                !!maxErrorsBeforeExit &&
                this.errorCount > maxErrorsBeforeExit
            ) {
                throw new FlowError(NodeError.TOO_MANY_ERRORS)
            }

            errors.push({
                nodeId: node.id,
                nodeType: node.type,
                date: new Date(),
                message: error.message,
                code: error.code
            })

            Logger.error(new Error('Error happend during node run'), error)

            originalErrorFn && originalErrorFn(node, error)
        }

        this.options.onLog = (
            node: FlowNode,
            message: string,
            type: LogType = LogType.INFO
        ) => {
            logs.push({
                type,
                date: new Date(),
                nodeId: node.id,
                nodeType: node.type,
                message
            })

            originalLogFn && originalLogFn(node, message, type)
        }

        this.options.onStorage = (data: StorageObject) => {
            const file: FileStorageObject = {
                ...data,
                createdAt: new Date()
            }
            files.push(file)

            originalStorageFn && originalStorageFn(data)
        }

        let status = Status.UNDETERMINED

        try {
            await this.parseNode({ node })

            if (errors.length === logs.length) {
                status = Status.ERROR
            } else {
                status = errors.length ? Status.PARTIAL_SUCCESS : Status.SUCCESS
            }
        } catch (error) {
            Logger.error(new Error('Fatal error during run'), error)
            status = Status.ERROR
        } finally {
            this.options.onError = originalErrorFn
            this.options.onLog = originalLogFn
            this.options.onStorage = originalStorageFn
            await this.cleanup()
        }

        return {
            status,
            errors,
            logs,
            files
        }
    }

    public cancel() {
        this.canceled = true
    }

    public async forceCancel() {
        this.canceled = true
        await this.cleanup()
        throw new Error('Operation was cancelled')
    }

    public async cleanup(): Promise<void> {
        const { browser } = this.context
        if (!browser) return
        await browser.cleanup()
        delete this.context.browser
    }
}

export default Traverser
