import { GraphQLFieldResolver } from 'graphql'
import JobService from 'services/job'
import { Job } from 'models/job'
import { ScheduleType } from 'services/job/typedefs'
import Logger from 'utils/logging/logger'
import { AuthenticationContext } from '../directives/auth'

export const getJobs: GraphQLFieldResolver<any, AuthenticationContext> = async (
    root,
    args,
    context
): Promise<Job[]> => {
    try {
        return await JobService.getJobs(context.user)
    } catch (error) {
        Logger.throw(new Error('Could not get jobs'), error, context.user)
    }
}

export const createJob: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    {
        input: {
            name: string
            workflowId: string
            type: ScheduleType
            schedule: any
        }
    }
> = async (root, args, context) => {
    const exists = await JobService.checkIfJobNameExists(
        context.user,
        args.input.name
    )

    if (exists) {
        throw new Error('A job with that name already exists')
    }

    try {
        return await JobService.createJob(
            context.user,
            args.input.name,
            args.input.workflowId,
            args.input.type,
            args.input.schedule
        )
    } catch (error) {
        Logger.throw(new Error('Could not create job'), error, context.user)
    }
}

export const removeJob: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    { id: string }
> = async (root, args, context) => {
    try {
        await JobService.removeJob(context.user, args.id)
        return true
    } catch (error) {
        Logger.throw(new Error('Could not remove job'), error, context.user)
    }
}

export const pauseJob: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    { id: string }
> = async (root, args, context) => {
    try {
        await JobService.pauseJob(context.user, args.id)
        return true
    } catch (error) {
        Logger.throw(new Error('Could not pause job'), error, context.user)
    }
}

export const resumeJob: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    { id: string }
> = async (root, args, context) => {
    try {
        await JobService.resumeJob(context.user, args.id)
        return true
    } catch (error) {
        Logger.throw(new Error('Could not resume job'), error, context.user)
    }
}

export const getJobLogs: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    { id: string }
> = async (root, args, context) => {
    try {
        return await JobService.getJobLogs(context.user, args.id)
    } catch (error) {
        Logger.throw(new Error('Could not get job logs'), error, context.user)
    }
}
