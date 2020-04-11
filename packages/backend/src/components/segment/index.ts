import Analytics from 'analytics-node'
import { User } from 'models/user'
import Logger from 'utils/logging/logger'
import { SegmentMessage, TrackingEvent } from './typedefs'

let analytics: Analytics

const initialize = () => {
    if (process.env.NODE_ENV === 'test') return

    analytics = new Analytics(process.env.SEGMENT_WRITE_KEY!)
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
            userId: user.id,
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
            userId: user.id,
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
