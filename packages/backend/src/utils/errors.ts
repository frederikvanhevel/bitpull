import { ApolloError } from 'apollo-server'

enum ErrorCodes {
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    NOT_ALLOWED = 'NOT_ALLOWED',
    BAD_REQUEST = 'BAD_REQUEST',
    EMAIL_IN_USE = 'EMAIL_IN_USE',
    WORKFLOW_IN_USE = 'WORKFLOW_IN_USE',
    LIMIT_REACHED = 'LIMIT_REACHED',
    RUNNER_TIMEOUT_REACHED = 'RUNNER_TIMEOUT_REACHED'
}

export class ClientError extends ApolloError {
    constructor(
        message: string = 'An unknown error occured',
        code: string = ErrorCodes.UNKNOWN_ERROR
    ) {
        super(message, code)
    }
}

export class NotFoundError extends ClientError {
    constructor() {
        super('Not found', ErrorCodes.NOT_FOUND)
    }
}

export class NotAllowedError extends ClientError {
    constructor() {
        super('Not allowed', ErrorCodes.NOT_ALLOWED)
    }
}

export class BadRequestError extends ClientError {
    constructor() {
        super('Bad request', ErrorCodes.BAD_REQUEST)
    }
}

export class EmailInUseError extends ClientError {
    constructor() {
        super('Email already in use', ErrorCodes.EMAIL_IN_USE)
    }
}

export class WorkflowInUseError extends ClientError {
    constructor() {
        super('Workflow is in use by running jobs', ErrorCodes.WORKFLOW_IN_USE)
    }
}

export class LimitReachedError extends ClientError {
    constructor() {
        super('Limit reached', ErrorCodes.LIMIT_REACHED)
    }
}

export class RunnerTimeoutReachedError extends ClientError {
    constructor() {
        super(
            'Test run timeout reached, schedule a job for longer running workflows',
            ErrorCodes.RUNNER_TIMEOUT_REACHED
        )
    }
}
