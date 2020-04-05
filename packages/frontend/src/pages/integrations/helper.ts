import querystring from 'query-string'
import { IntegrationType } from 'typedefs/graphql'

export const redirect = (type: IntegrationType) => {
    if (type === IntegrationType.SLACK) {
        const queryString = querystring.stringify({
            client_id: process.env.SLACK_CLIENT_ID,
            scope: 'chat:write:bot channels:read',
            redirect_uri: `${document.location.origin}/integrations/slack`
        })
        window.location.href = `https://slack.com/oauth/authorize?${queryString}`
    } else if (type === IntegrationType.DROPBOX) {
        const queryString = querystring.stringify({
            client_id: process.env.DROPBOX_CLIENT_ID,
            response_type: 'code',
            redirect_uri: `${document.location.origin}/integrations/dropbox`
        })
        window.location.href = `https://www.dropbox.com/oauth2/authorize?${queryString}`
    } else if (type === IntegrationType.GOOGLE_DRIVE) {
        const queryString = querystring.stringify({
            client_id: process.env.GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/drive.file',
            response_type: 'code',
            redirect_uri: `${document.location.origin}/integrations/google-drive`,
            access_type: 'offline'
        })
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${queryString}`
    } else if (type === IntegrationType.ONEDRIVE) {
        const queryString = querystring.stringify({
            client_id: process.env.ONEDRIVE_CLIENT_ID,
            scope: 'Files.ReadWrite offline_access',
            response_type: 'code',
            redirect_uri: `${document.location.origin}/integrations/onedrive`
        })
        window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${queryString}`
    } else if (type === IntegrationType.GITHUB) {
        const queryString = querystring.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            scope: 'repo',
            response_type: 'code',
            redirect_uri: `${document.location.origin}/integrations/github`
        })
        window.location.href = `https://github.com/login/oauth/authorize?${queryString}`
    }
}
