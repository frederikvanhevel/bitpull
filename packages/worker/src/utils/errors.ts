import {
    NodeError,
    FileError,
    ParseError,
    IntegrationError
} from '../nodes/common/errors'
import { CsvError } from '../nodes/processing/csv/errors'
import { ExeclError } from '../nodes/processing/excel/errors'
import { DropboxError } from '../nodes/export/dropbox/errors'
import { OneDriveError } from '../nodes/export/onedrive/errors'
import { GoogleDriveError } from '../nodes/export/google-drive/errors'
import { FunctionError } from '../nodes/export/function/errors'
import { StorageError } from '../nodes/export/storage/errors'
import { WebhookError } from '../nodes/export/webhook/errors'
import { SlackError } from '../nodes/notification/slack/errors'
import { PaginationError } from '../nodes/processing/pagination/errors'
import { CollectError } from '../nodes/processing/collect/errors'
import { HtmlError } from '../nodes/processing/html/errors'
import { LoginError } from '../nodes/processing/login/errors'
import { WaitError } from '../nodes/processing/wait/errors'
import { EmailError } from '../nodes/notification/email/errors'
import { GithubError } from '../nodes/export/github/errors'
import { ClickError } from '../nodes/processing/click/errors'

export const ErrorMessages: Record<string, string> = {
    // Node error
    [NodeError.NEEDS_ROOT_ANCESTOR]:
        'Needs to have html or xml as previous step',
    [NodeError.NODE_NOT_FOUND]: 'Step was not found',
    [NodeError.NO_RESULT]: 'Step did not have any results',
    [NodeError.TOO_MANY_CHILDREN]: "Step can't have so many next steps",
    [NodeError.NO_CHILDREN_ALLOWED]: 'No next steps allowed',
    [NodeError.NEEDS_PARENT]: 'Needs parent step',
    [NodeError.CHILD_NODE_MISSING]: 'Next step is required',
    [NodeError.NEEDS_REAL_BROWSER]: 'Feature not available in fast mode',
    [NodeError.UNKNOWN_ERROR]: 'An unknown error occured',
    [NodeError.TOO_MANY_ERRORS]: 'Too many errors occured',
    [NodeError.EXPORT_NODE_MISSING]: 'You need to specify an export method',

    // File error
    [FileError.FILE_MISSING]: 'File is missing',
    [FileError.INVALID_FILE_PATH]: 'Invalid file path',
    [FileError.INVALID_FILE_NAME]: 'Invalid file name',
    [FileError.INVALID_DIRECTORY]: 'Directory is invalid',
    [FileError.BUFFER_EMPTY]: 'Buffer is empty',

    // Parse error
    [ParseError.LINK_MISSING]: 'No link was defined',
    [ParseError.SELECTOR_MISSING]: 'No selector was defined',
    [ParseError.ERROR_RENDERING_HTML]: 'Could not get website content',
    [ParseError.NO_SELECTOR_PARSER_FOUND]: 'No suitable selecor parser found',
    [ParseError.HTML_MISSING]: 'Coudl not get website content',

    // Integration error
    [IntegrationError.INTEGRATION_MISSING]: 'Integration is not set up',
    [IntegrationError.INTEGRATION_INACTIVE]: 'Integration is not active',
    [IntegrationError.ACCESS_TOKEN_MISSING]:
        'Integration credentials missing or incorrect',

    // Function error
    [FunctionError.NO_FUNCTION_SPECIFIED]: 'No function specified',

    // Storage error
    [StorageError.STORAGE_OPTIONS_MISSING]: 'Storage options missing',
    [StorageError.AWS_BUCKET_MISSING]: 'AWS bucket not specified',
    [StorageError.AWS_ACCESS_KEY_ID_MISSING]: 'AWS access key missing',
    [StorageError.AWS_SECRET_ACCESS_KEY_MISSING]: 'AWS secret missing',
    [StorageError.INVALID_PARENT_TYPE]: 'Previous step does not produce a file',

    // Dropbox error
    [DropboxError.UPLOAD_FAILED]: 'Error uploading to Dropbox',

    // OneDrive error
    [OneDriveError.UPLOAD_FAILED]: 'Error uploading to OneDrive',

    // OneDrive error
    [GoogleDriveError.UPLOAD_FAILED]: 'Error uploading to Google Drive',

    // OneDrive error
    [GithubError.UPLOAD_FAILED]: 'Error uploading to Github',
    [GithubError.REPOSITORY_MISSING]: 'No Github repository specified',
    [GithubError.WRONG_REPOSITORY_FORMAT]: 'Invalid Github repository',

    // Webhook error
    [WebhookError.REQUEST_PATH_MISSING]: 'Invalid webhook path',

    // Slack error
    [SlackError.CHANNEL_MISSING]: 'Slack channel is not defined',

    // Email error
    [EmailError.TO_ADDRESS_MISSING]: 'To email address not specified',

    // Collect error
    [CollectError.FIELDS_MISSING]: 'Selector fields are missing',

    // Html error
    [HtmlError.LINKED_FIELD_MISSING]: 'Linked field is not defined',

    // Pagination error
    [PaginationError.GOTOPERPAGE_NODE_MISSING]: 'No per page step specified',
    [PaginationError.PAGINATION_METHOD_MISSING]: 'Pagination method missing',
    [PaginationError.NEXT_LINK_MISSING]: 'Next link was not specified',
    [PaginationError.NO_LINKS_SPECIFIED]: 'No links were specified',

    // Login error
    [LoginError.CREDENTIALS_MISSING]: 'Credentials missing',
    [LoginError.ENCRYPTION_KEY_MISSING]:
        'Encryption key is missing or corrupted',
    [LoginError.ENCRYPTION_VERSION_UNSUPPORTED]:
        'Encryption version is unsupported',
    [LoginError.COULD_NOT_LOGIN]: 'Could not login',

    // Wait error
    [WaitError.DELAY_MISSING]: 'No time to wait specified',

    // Click error
    [ClickError.COULD_NOT_CLICK]: 'Could not click element',

    // CSV error
    [CsvError.COULD_NOT_CREATE]: 'Could not write csv file',

    // Eccel error
    [ExeclError.COULD_NOT_CREATE]: 'Could not write excel file'
}

export class FlowError extends Error {
    public code: string
    constructor(code: string) {
        if (!ErrorMessages[code]) {
            console.warn(`Missing error message for ${code}`)
            super(ErrorMessages[NodeError.UNKNOWN_ERROR])
            this.code = NodeError.UNKNOWN_ERROR
            return
        }

        super(ErrorMessages[code])
        this.code = code
    }
}
