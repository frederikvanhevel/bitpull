import Analytics from 'analytics-node'
import { User } from 'models/user'
import Logger from 'utils/logging/logger'
import Config from 'utils/config'
import { SegmentMessage, TrackingEvent } from './typedefs'

let analytics: Analytics

const initialize = () => {
    if (Config.NODE_ENV !== 'production') return

    analytics = new Analytics(Config.SEGMENT_WRITE_KEY)
}

const getUserId = (user: User) => {
    if (user.id) return user.id
    else if (typeof user._id === 'string') return user._id
    return user._id.toHexString()
}

const track = (
    event: TrackingEvent,
    user: User,
    message: SegmentMessage = {}
) => {
    if (!analytics) return

    try {
        analytics.track({
            event,
            timestamp: new Date(),
            userId: getUserId(user),
            ...message
        })
    } catch (error) {
        Logger.error(new Error('Could not track Segment event'), error, user)
    }
}

const identify = (user: User) => {
    if (!analytics) return

    try {
        analytics.identify({
            userId: getUserId(user),
            traits: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
                // plan
            }
        })
    } catch (error) {
        Logger.error(
            new Error('Could not identify user in Segment'),
            error,
            user
        )
    }
}

const Segment = {
    initialize,
    track,
    identify
}

export default Segment
export * from './typedefs'
