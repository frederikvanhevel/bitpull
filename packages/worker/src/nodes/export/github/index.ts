import request from 'request-promise-native'
import Logger from '../../../utils/logging/logger'
import { FileError, IntegrationError } from '../../common/errors'
import { NodeParser, NodeInput, UploadedFile } from '../../../typedefs/node'
import { assert } from '../../../utils/common'
import { FileWriteResult, readFile, FileEncoding } from '../../../utils/file'
import { IntegrationType, StorageService } from '../../../typedefs/common'
import { FlowError } from '../../../utils/errors'
import { GithubNode } from './typedefs'
import { GithubError } from './errors'

const GITHUB_API_URL = 'https://api.github.com'

const github: NodeParser<GithubNode> = async (
    input: NodeInput<GithubNode, FileWriteResult>,
    options
) => {
    const { integrations = [], onLog, onStorage } = options
    const { node, passedData } = input

    const githubIntegration = integrations.find(
        integration => integration.type === IntegrationType.GITHUB
    )

    assert(passedData && passedData.path, FileError.INVALID_FILE_PATH)
    assert(passedData && passedData.fileName, FileError.INVALID_FILE_NAME)
    assert(node.repo, GithubError.REPOSITORY_MISSING)
    assert(/.*\/.*/.test(node.repo), GithubError.WRONG_REPOSITORY_FORMAT)
    assert(githubIntegration, IntegrationError.INTEGRATION_MISSING)
    assert(githubIntegration.active, IntegrationError.INTEGRATION_INACTIVE)
    assert(
        githubIntegration.settings.access_token,
        IntegrationError.ACCESS_TOKEN_MISSING
    )

    // // upload file
    let result
    try {
        result = await request({
            uri:
                GITHUB_API_URL +
                `/repos/${node.repo}/contents/${passedData.fileName}`,
            method: 'PUT',
            body: {
                message: 'Uploaded file via BitPull.io',
                committer: {
                    name: 'BitPull.io',
                    email: 'bot@bitpull.io'
                },
                content: await readFile(passedData.path, FileEncoding.BASE64)
            },
            json: true,
            headers: {
                Authorization: `Bearer ${githubIntegration.settings.access_token}`,
                'User-Agent': 'BitPull.io'
            }
        })
    } catch (error) {
        throw new FlowError(GithubError.UPLOAD_FAILED, error)
    }

    if (onLog) {
        onLog(
            node,
            `File successfully uploaded to Github: ${passedData.fileName}`
        )
    }

    if (onStorage) {
        onStorage({
            service: StorageService.GITHUB,
            fileName: result.content.name,
            url: result.content.html_url,
            contentType: passedData.contentType
        })
    }

    return {
        ...input,
        passedData: {
            name: result.content.name,
            url: result.content.html_url
        } as UploadedFile
    }
}

export default github
