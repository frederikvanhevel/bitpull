import { mocked } from 'ts-jest/utils'
import IntegrationModel, { Integration } from 'models/integration'
import { IntegrationFactory } from 'models/integration/__mocks__/integration.mock'
import { UserFactory } from 'models/user/__mocks__/user.mock'
import Google from 'components/integrations/google'
import Onedrive from 'components/integrations/onedrive'
import { IntegrationType } from '@bitpull/worker'
import IntegrationService from '../index'

jest.mock('models/integration')
const mockedIntegrationModel = mocked(IntegrationModel)

jest.mock('components/integrations/google')
const mockedGoogle = mocked(Google)

jest.mock('components/integrations/onedrive')
const mockedOneDrive = mocked(Onedrive)

describe('Integration service', () => {
    it('should get active integrations', async () => {
        const items = IntegrationFactory.getArray(1)

        mockedIntegrationModel.find.mockReturnValueOnce({
            // @ts-ignore
            lean: () => items
        })

        const result = await IntegrationService.getActiveIntegrations(
            items[0].owner
        )

        expect(result).toEqual([
            {
                ...items[0],
                hasSettings: true
            }
        ])
    })

    it('should update an integration', async () => {
        const user = UserFactory.getSingleRecord()

        mockedIntegrationModel.findOneAndUpdate.mockReturnValueOnce({
            // @ts-ignore
            lean: () => true
        })

        await IntegrationService.updateIntegration(user, '123', {
            active: false
        } as Integration)

        expect(mockedIntegrationModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '123', owner: user._id },
            { active: false },
            { new: true }
        )
    })

    it('should remove an integration', async () => {
        const item = IntegrationFactory.getSingleRecord()

        mockedIntegrationModel.findById.mockResolvedValueOnce(item)

        await IntegrationService.removeIntegration(item.owner, item.id)

        expect(item.remove).toHaveBeenCalled()
    })

    it('should toggle an integration', async () => {
        const item = IntegrationFactory.getSingleRecord()

        mockedIntegrationModel.findById.mockResolvedValueOnce(item)

        await IntegrationService.toggleIntegration(item.owner, item.id, false)

        expect(item.active).toEqual(false)
        expect(item.save).toHaveBeenCalled()
    })

    it('should get updated integrations', async () => {
        const items = [
            IntegrationFactory.getSingleRecord({
                type: IntegrationType.SLACK
            } as Integration),
            IntegrationFactory.getSingleRecord({
                type: IntegrationType.DROPBOX
            } as Integration),
            IntegrationFactory.getSingleRecord({
                type: IntegrationType.GOOGLE_DRIVE
            } as Integration),
            IntegrationFactory.getSingleRecord({
                type: IntegrationType.ONEDRIVE
            } as Integration)
        ]

        mockedIntegrationModel.find.mockReturnValueOnce({
            // @ts-ignore
            lean: () => items
        })

        mockedGoogle.refreshToken.mockResolvedValueOnce(items[2])
        mockedOneDrive.refreshToken.mockResolvedValueOnce(items[3])

        const result = await IntegrationService.getUpdatedIntegrations(
            items[0].owner.id
        )

        expect(mockedGoogle.refreshToken).toHaveBeenCalledWith(items[2])
        expect(mockedOneDrive.refreshToken).toHaveBeenCalledWith(items[3])
        expect(result).toEqual(items)
    })
})
