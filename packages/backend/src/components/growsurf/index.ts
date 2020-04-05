import axios, { AxiosRequestConfig } from 'axios'
import { User } from 'models/user'
import { Participant, ErrorCode } from './typedefs'

const CAMPAIGN_ID = process.env.GROWSURF_CAMPAIGN_ID
export const API_PREFIX = `https://api.growsurf.com/v2/campaign/${CAMPAIGN_ID}`

class Growwsurf {
    private static async makeRequest(
        method: AxiosRequestConfig['method'],
        path: string,
        data: object = {}
    ) {
        let result
        try {
            result = await axios.request({
                url: `${API_PREFIX}${path}`,
                method,
                data,
                headers: {
                    Authorization: `Bearer ${process.env.GROWSURF_API_TOKEN}`
                }
            })
        } catch (error) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message)
            } else {
                throw error
            }
        }

        return result.data
    }

    private static async getParticipantByEmail(
        email: string
    ): Promise<Participant> {
        return await this.makeRequest(
            'GET',
            `/participant/${encodeURIComponent(email)}`
        )
    }

    public static async addParticipant(
        user: User,
        referralId?: string
    ): Promise<Participant> {
        const participant: Participant = await this.makeRequest(
            'POST',
            `/participant`,
            {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                referredBy: referralId
                // referralStatus: referralId
                //     ? CreditStatus.CREDIT_PENDING // pending until we manually approve the referral
                //     : undefined
            }
        )

        return participant
    }

    public static async updateParticipant(
        email: string,
        data: Partial<Participant>
    ): Promise<Participant> {
        const participant: Participant = await this.makeRequest(
            'POST',
            `/participant/${encodeURIComponent(email)}`,
            data
        )

        return participant
    }

    public static async getParticipant(user: User): Promise<Participant> {
        try {
            return await this.getParticipantByEmail(user.email)
        } catch (error) {
            if (error.response?.data.code !== ErrorCode.PARTICIPANT_NOT_FOUND) {
                throw error
            }

            // if this is an older user that doesn't have a growsurf
            // account yet, sign him up!
            return await this.addParticipant(user)
        }
    }

    public static async triggerReferral(user: User) {
        try {
            await this.makeRequest(
                'POST',
                `/participant/${encodeURIComponent(user.email)!}/ref`
            )
        } catch (error) {
            if (error.response?.data.code !== ErrorCode.PARTICIPANT_NOT_FOUND) {
                throw error
            }
        }
    }
}

export default Growwsurf
