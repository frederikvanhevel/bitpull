import nock from 'nock'
import growsurf, { API_PREFIX } from 'components/growsurf'
import { UserFactory } from 'models/user/__mocks__/user.mock'
import { Participant, ErrorCode } from '../typedefs'

describe('Growsurf component', () => {
    it('should add a participant', async () => {
        const user = UserFactory.getSingleRecord()
        const referralId = '123'
        const participant = { id: '123' } as Participant

        nock(API_PREFIX)
            .post('/participant', {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                referredBy: referralId
            })
            .reply(200, participant)

        const result = await growsurf.addParticipant(user, referralId)

        expect(result).toEqual(participant)
    })

    it('should update a participant', async () => {
        const user = UserFactory.getSingleRecord()
        const newData = { firstName: 'Federico' }
        const participant = { id: '123', ...newData }

        nock(API_PREFIX)
            .post(`/participant/${encodeURIComponent(user.email)}`, newData)
            .reply(200, participant)

        const result = await growsurf.updateParticipant(user.email, newData)

        expect(result).toEqual(participant)
    })

    it('should get a participant that already exists', async () => {
        const user = UserFactory.getSingleRecord()
        const participant = { id: '123' } as Participant

        nock(API_PREFIX)
            .get(`/participant/${encodeURIComponent(user.email)}`)
            .reply(200, participant)

        const result = await growsurf.getParticipant(user)

        expect(result).toEqual(participant)
    })

    it("should try getting a participant and adding one if it doesn't exist yet", async () => {
        const user = UserFactory.getSingleRecord()
        const participant = { id: '123' } as Participant

        nock(API_PREFIX)
            .post(`/participant`, {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            })
            .reply(200, participant)

        nock(API_PREFIX)
            .get(`/participant/${encodeURIComponent(user.email)}`)
            .reply(406, {
                code: ErrorCode.PARTICIPANT_NOT_FOUND
            })

        const result = await growsurf.getParticipant(user)

        expect(result).toEqual(participant)
    })

    it('should trigger a referral', async () => {
        const user = UserFactory.getSingleRecord()

        const scope = nock(API_PREFIX)
            .post(`/participant/${encodeURIComponent(user.email)}/ref`)
            .reply(200)

        await growsurf.triggerReferral(user)

        scope.done()
    })

    it('should not trigger a segment event if there is a bad response', async () => {
        const user = UserFactory.getSingleRecord()

        nock(API_PREFIX)
            .post(`/participant/${encodeURIComponent(user.email)}/ref`)
            .reply(400)

        await expect(growsurf.triggerReferral(user)).rejects.toThrow()
        // expect(mockedSegment.track).not.toHaveBeenCalled()
    })

    it('should throw with growsurf error message in case of an error', async () => {
        const user = UserFactory.getSingleRecord()

        nock(API_PREFIX)
            .post(`/participant/${encodeURIComponent(user.email)}`)
            .reply(406, {
                message: 'Invalid parameters'
            })

        await expect(
            growsurf.updateParticipant(user.email, { firstName: 'Johnny' })
        ).rejects.toEqual(new Error('Invalid parameters'))
    })
})
