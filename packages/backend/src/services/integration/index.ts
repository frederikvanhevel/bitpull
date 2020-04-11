import IntegrationModel, { Integration } from 'models/integration'
import { NotFoundError, NotAllowedError } from 'utils/errors'
import { IntegrationType } from '@bitpull/worker'
import Google from 'components/integrations/google'
import Onedrive from 'components/integrations/onedrive'
import { User } from 'models/user'
import Segment, { TrackingEvent } from 'components/segment'

const getActiveIntegrations = async (user: User) => {
    const integrations: Integration[] = await IntegrationModel.find({
        owner: user._id
    }).lean()

    return integrations.map((integration: Integration) => ({
        ...integration,
        hasSettings: !!integration.settings
    }))
}

const updateIntegration = async (
    user: User,
    integrationId: string,
    data: Partial<Integration>
): Promise<Integration | null> => {
    return await IntegrationModel.findOneAndUpdate(
        { _id: integrationId, owner: user._id },
        data,
        { new: true }
    ).lean()
}

const removeIntegration = async (user: User, integrationId: string) => {
    const integrationToRemove = await IntegrationModel.findById(integrationId)

    if (!integrationToRemove) {
        throw new NotFoundError()
    }

    if (!integrationToRemove.owner.equals(user.id)) {
        throw new NotAllowedError()
    }

    Segment.track(TrackingEvent.INTEGRATION_REMOVE, user, {
        properties: {
            integration: integrationToRemove.type
        }
    })

    await integrationToRemove.remove()
}

const toggleIntegration = async (
    user: User,
    integrationId: string,
    enabled: boolean
) => {
    const integrationToToggle = await IntegrationModel.findById(integrationId)

    if (!integrationToToggle) {
        throw new NotFoundError()
    }

    if (!integrationToToggle.owner.equals(user.id)) {
        throw new NotAllowedError()
    }

    integrationToToggle.active = enabled

    Segment.track(TrackingEvent.INTEGRATION_TOGGLE, user, {
        properties: {
            integration: integrationToToggle.type,
            enabled
        }
    })

    await integrationToToggle.save()
}

const getUpdatedIntegrations = async (
    userId: string
): Promise<Integration[]> => {
    const integrations: Integration[] = await IntegrationModel.find({
        owner: userId
    }).lean()

    const updatedIntegrations = integrations.map((integration: Integration) => {
        if (integration.type === IntegrationType.GOOGLE_DRIVE) {
            return Google.refreshToken(integration)
        } else if (integration.type === IntegrationType.ONEDRIVE) {
            return Onedrive.refreshToken(integration)
        }

        return integration
    })

    return await Promise.all(updatedIntegrations)
}

const IntegrationService = {
    getActiveIntegrations,
    updateIntegration,
    removeIntegration,
    toggleIntegration,
    getUpdatedIntegrations
}

export default IntegrationService
