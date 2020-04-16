// @ts-ignore
import StackdriverErrorReporter from 'stackdriver-errors-js'

const MISSING_ERROR = 'Error was swallowed during propagation.'
let errorHandler: StackdriverErrorReporter

const initialize = async (): StackdriverErrorReporter => {
    if (process.env.NODE_ENV !== 'production') return

    errorHandler = new StackdriverErrorReporter()
    errorHandler.start({
        key: process.env.STACKDRIVER_API_KEY,
        projectId: process.env.GCLOUD_PROJECT,
        service: 'frontend'
    })

    return errorHandler
}

const logError = (error: Error) => {
    if (process.env.NODE_ENV !== 'production') return

    const errorObj = error || new Error(MISSING_ERROR)
    errorHandler.report(errorObj)
}

const setLogUserContext = (customerId: string) => {
    if (process.env.NODE_ENV !== 'production') return

    errorHandler.setUser(customerId)
}

const stackdriver = {
    initialize,
    error: logError,
    setUser: setLogUserContext
}

export default stackdriver
