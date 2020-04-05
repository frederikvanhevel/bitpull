import { Participant, Reward } from 'components/growsurf/typedefs'

export enum WebhookEvent {
    PARTICIPANT_REACHED_A_GOAL = 'PARTICIPANT_REACHED_A_GOAL'
}

interface WebhookParticipant extends Participant {
    referrer?: Participant
}

export interface RewardWebhook {
    event: WebhookEvent
    data: {
        participant: WebhookParticipant
        reward: Reward
    }
}
