"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../nodes/common/errors");
const errors_2 = require("../nodes/export/dropbox/errors");
const errors_3 = require("../nodes/export/onedrive/errors");
const errors_4 = require("../nodes/export/google-drive/errors");
const errors_5 = require("../nodes/export/function/errors");
const errors_6 = require("../nodes/export/storage/errors");
const errors_7 = require("../nodes/export/webhook/errors");
const errors_8 = require("../nodes/notification/slack/errors");
const errors_9 = require("../nodes/processing/pagination/errors");
const errors_10 = require("../nodes/processing/collect/errors");
const errors_11 = require("../nodes/processing/html/errors");
const errors_12 = require("../nodes/processing/login/errors");
const errors_13 = require("../nodes/processing/wait/errors");
const errors_14 = require("../nodes/notification/email/errors");
const errors_15 = require("../nodes/export/github/errors");
exports.ErrorMessages = {
    // Node error
    [errors_1.NodeError.NEEDS_ROOT_ANCESTOR]: 'Needs to have a html or xml node as parent',
    [errors_1.NodeError.NODE_NOT_FOUND]: 'Node was not found',
    [errors_1.NodeError.NO_RESULT]: 'Node did not have any results',
    [errors_1.NodeError.TOO_MANY_CHILDREN]: "Node can't have so many child nodes",
    [errors_1.NodeError.NO_CHILDREN_ALLOWED]: 'No child nodes allowed',
    [errors_1.NodeError.NEEDS_PARENT]: 'Needs parent node',
    [errors_1.NodeError.CHILD_NODE_MISSING]: 'Child node is required',
    [errors_1.NodeError.NEEDS_REAL_BROWSER]: 'Feature not available in fast mode',
    [errors_1.NodeError.UNKNOWN_ERROR]: 'An unknown error occured',
    [errors_1.NodeError.TOO_MANY_ERRORS]: 'Too many errors occured',
    // File error
    [errors_1.FileError.FILE_MISSING]: 'File is missing',
    [errors_1.FileError.INVALID_FILE_PATH]: 'Invalid file path',
    [errors_1.FileError.INVALID_FILE_NAME]: 'Invalid file name',
    [errors_1.FileError.INVALID_DIRECTORY]: 'Directory is invalid',
    [errors_1.FileError.BUFFER_EMPTY]: 'Buffer is empty',
    // Parse error
    [errors_1.ParseError.LINK_MISSING]: 'No link was defined',
    [errors_1.ParseError.SELECTOR_MISSING]: 'No selector was defined',
    [errors_1.ParseError.ERROR_RENDERING_HTML]: 'Could not get website content',
    [errors_1.ParseError.NO_SELECTOR_PARSER_FOUND]: 'No suitable selecor parser found',
    [errors_1.ParseError.HTML_MISSING]: 'Website content is not defined',
    // Integration error
    [errors_1.IntegrationError.INTEGRATION_MISSING]: 'Integration is not set up',
    [errors_1.IntegrationError.INTEGRATION_INACTIVE]: 'Integration is not active',
    [errors_1.IntegrationError.ACCESS_TOKEN_MISSING]: 'Integration credentials missing or incorrect',
    // Function error
    [errors_5.FunctionError.NO_FUNCTION_SPECIFIED]: 'No function specified',
    // Storage error
    [errors_6.StorageError.STORAGE_OPTIONS_MISSING]: 'Storage options missing',
    [errors_6.StorageError.AWS_BUCKET_MISSING]: 'AWS bucket not specified',
    [errors_6.StorageError.AWS_ACCESS_KEY_ID_MISSING]: 'AWS access key missing',
    [errors_6.StorageError.AWS_SECRET_ACCESS_KEY_MISSING]: 'AWS secret missing',
    [errors_6.StorageError.INVALID_PARENT_TYPE]: 'Parent node does not produce a file',
    // Dropbox error
    [errors_2.DropboxError.UPLOAD_FAILED]: 'Error uploading to Dropbox',
    // OneDrive error
    [errors_3.OneDriveError.UPLOAD_FAILED]: 'Error uploading to OneDrive',
    // OneDrive error
    [errors_4.GoogleDriveError.UPLOAD_FAILED]: 'Error uploading to Google Drive',
    // OneDrive error
    [errors_15.GithubError.UPLOAD_FAILED]: 'Error uploading to Github',
    [errors_15.GithubError.REPOSITORY_MISSING]: 'No Github repository specified',
    [errors_15.GithubError.WRONG_REPOSITORY_FORMAT]: 'Invalid Github repository',
    // Webhook error
    [errors_7.WebhookError.REQUEST_PATH_MISSING]: 'Invalid webhook path',
    // Slack error
    [errors_8.SlackError.CHANNEL_MISSING]: 'Slack channel is not defined',
    // Email error
    [errors_14.EmailError.TO_ADDRESS_MISSING]: 'To email address not specified',
    // Collect error
    [errors_10.CollectError.FIELDS_MISSING]: 'Selector fields are missing',
    // Html error
    [errors_11.HtmlError.LINKED_FIELD_MISSING]: 'Linked field is not defined',
    // Pagination error
    [errors_9.PaginationError.GOTOPERPAGE_NODE_MISSING]: 'No page node specified',
    [errors_9.PaginationError.PAGINATION_METHOD_MISSING]: 'Pagination method missing',
    [errors_9.PaginationError.NEXT_LINK_MISSING]: 'Next link was not specified',
    [errors_9.PaginationError.NO_LINKS_SPECIFIED]: 'No links were specified',
    // Login error
    [errors_12.LoginError.CREDENTIALS_MISSING]: 'Credentials missing',
    [errors_12.LoginError.ENCRYPTION_KEY_MISSING]: 'Encryption key is missing or corrupted',
    [errors_12.LoginError.ENCRYPTION_VERSION_UNSUPPORTED]: 'Encryption version is unsupported',
    [errors_13.WaitError.DELAY_MISSING]: 'No time to wait specified'
};
class FlowError extends Error {
    constructor(code) {
        if (!exports.ErrorMessages[code]) {
            console.warn(`Missing error message for ${code}`);
            super(errors_1.NodeError.UNKNOWN_ERROR);
            this.code = errors_1.NodeError.UNKNOWN_ERROR;
            return;
        }
        super(exports.ErrorMessages[code]);
        this.code = code;
    }
}
exports.FlowError = FlowError;
