import { TrackingEvent } from './typedefs'
import { User } from 'queries/user/typedefs'
import Logger from 'utils/logger'

analytics.load(process.env.SEGMENT_WRITE_KEY!)

const track = (event: TrackingEvent, traits?: object) => {
    try {
        analytics.track(event, traits)
    } catch (error) {
        Logger.error(error)
    }
}

const page = (path: string) => {
    try {
        analytics.page(path)
    } catch (error) {
        Logger.error(error)
    }
}

const identify = (user: User) => {
    try {
        analytics.identify(user.id, {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        })
    } catch (error) {
        Logger.error(error)
    }
}

const clear = () => {
    analytics.reset()
}

const Segment = {
    track,
    page,
    identify,
    clear
}

export default Segment
export * from './typedefs'
