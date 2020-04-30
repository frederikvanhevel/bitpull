"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../nodes/common/errors");
const errors_2 = require("../nodes/processing/csv/errors");
const errors_3 = require("../nodes/processing/excel/errors");
const errors_4 = require("../nodes/export/dropbox/errors");
const errors_5 = require("../nodes/export/onedrive/errors");
const errors_6 = require("../nodes/export/google-drive/errors");
const errors_7 = require("../nodes/export/function/errors");
const errors_8 = require("../nodes/export/storage/errors");
const errors_9 = require("../nodes/export/webhook/errors");
const errors_10 = require("../nodes/notification/slack/errors");
const errors_11 = require("../nodes/processing/pagination/errors");
const errors_12 = require("../nodes/processing/collect/errors");
const errors_13 = require("../nodes/processing/html/errors");
const errors_14 = require("../nodes/processing/login/errors");
const errors_15 = require("../nodes/processing/wait/errors");
const errors_16 = require("../nodes/notification/email/errors");
const errors_17 = require("../nodes/export/github/errors");
const errors_18 = require("../nodes/processing/click/errors");
const errors_19 = require("../nodes/processing/scroll/errors");
const logger_1 = __importDefault(require("./logging/logger"));
exports.ErrorMessages = {
    // Node error
    [errors_1.NodeError.NEEDS_ROOT_ANCESTOR]: 'Needs to have html or xml as previous step',
    [errors_1.NodeError.NODE_NOT_FOUND]: 'Step was not found',
    [errors_1.NodeError.NO_RESULT]: 'Step did not have any results',
    [errors_1.NodeError.TOO_MANY_CHILDREN]: "Step can't have so many next steps",
    [errors_1.NodeError.NO_CHILDREN_ALLOWED]: 'No next steps allowed',
    [errors_1.NodeError.NEEDS_PARENT]: 'Needs parent step',
    [errors_1.NodeError.CHILD_NODE_MISSING]: 'Next step is required',
    [errors_1.NodeError.NEEDS_REAL_BROWSER]: 'Feature not available in fast mode',
    [errors_1.NodeError.UNKNOWN_ERROR]: 'An unknown error occured',
    [errors_1.NodeError.TOO_MANY_ERRORS]: 'Too many errors occured',
    [errors_1.NodeError.EXPORT_NODE_MISSING]: 'You need to specify an export method',
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
    [errors_1.ParseError.HTML_MISSING]: 'Could not get website content',
    [errors_1.ParseError.PAGE_MISSING]: 'Could not open website',
    [errors_1.ParseError.NO_DATA]: 'No data to export',
    // Integration error
    [errors_1.IntegrationError.INTEGRATION_MISSING]: 'Integration is not set up',
    [errors_1.IntegrationError.INTEGRATION_INACTIVE]: 'Integration is not active',
    [errors_1.IntegrationError.ACCESS_TOKEN_MISSING]: 'Integration credentials missing or incorrect',
    // Function error
    [errors_7.FunctionError.NO_FUNCTION_SPECIFIED]: 'No function specified',
    // Storage error
    [errors_8.StorageError.STORAGE_OPTIONS_MISSING]: 'Storage options missing',
    [errors_8.StorageError.AWS_BUCKET_MISSING]: 'AWS bucket not specified',
    [errors_8.StorageError.AWS_ACCESS_KEY_ID_MISSING]: 'AWS access key missing',
    [errors_8.StorageError.AWS_SECRET_ACCESS_KEY_MISSING]: 'AWS secret missing',
    [errors_8.StorageError.INVALID_PARENT_TYPE]: 'Previous step does not produce a file',
    // Dropbox error
    [errors_4.DropboxError.UPLOAD_FAILED]: 'Error uploading to Dropbox',
    // OneDrive error
    [errors_5.OneDriveError.UPLOAD_FAILED]: 'Error uploading to OneDrive',
    // OneDrive error
    [errors_6.GoogleDriveError.UPLOAD_FAILED]: 'Error uploading to Google Drive',
    // OneDrive error
    [errors_17.GithubError.UPLOAD_FAILED]: 'Error uploading to Github',
    [errors_17.GithubError.REPOSITORY_MISSING]: 'No Github repository specified',
    [errors_17.GithubError.WRONG_REPOSITORY_FORMAT]: 'Invalid Github repository',
    // Webhook error
    [errors_9.WebhookError.REQUEST_PATH_MISSING]: 'Invalid webhook path',
    // Slack error
    [errors_10.SlackError.CHANNEL_MISSING]: 'Slack channel is not defined',
    // Email error
    [errors_16.EmailError.TO_ADDRESS_MISSING]: 'To email address not specified',
    // Collect error
    [errors_12.CollectError.FIELDS_MISSING]: 'Selector fields are missing',
    // Html error
    [errors_13.HtmlError.LINKED_FIELD_MISSING]: 'Linked field is not defined',
    [errors_13.HtmlError.LINKS_MISSING]: 'No links are defined',
    [errors_13.HtmlError.INVALID_URL]: 'The given url is invalid',
    // Pagination error
    [errors_11.PaginationError.GOTOPERPAGE_NODE_MISSING]: 'No per page step specified',
    [errors_11.PaginationError.PAGINATION_METHOD_MISSING]: 'Pagination method missing',
    [errors_11.PaginationError.NEXT_LINK_MISSING]: 'Next link was not specified',
    [errors_11.PaginationError.NO_LINKS_SPECIFIED]: 'No links were specified',
    // Login error
    [errors_14.LoginError.CREDENTIALS_MISSING]: 'Credentials missing',
    [errors_14.LoginError.ENCRYPTION_KEY_MISSING]: 'Encryption key is missing or corrupted',
    [errors_14.LoginError.ENCRYPTION_VERSION_UNSUPPORTED]: 'Encryption version is unsupported',
    [errors_14.LoginError.COULD_NOT_LOGIN]: 'Could not login',
    // Wait error
    [errors_15.WaitError.DELAY_MISSING]: 'No time to wait specified',
    // Click error
    [errors_18.ClickError.COULD_NOT_CLICK]: 'Could not click element, perhaps it is not visble',
    // CSV error
    [errors_2.CsvError.COULD_NOT_CREATE_CSV]: 'Could not write csv file',
    // Eccel error
    [errors_3.ExeclError.COULD_NOT_CREATE_EXCEL]: 'Could not write excel file',
    // Scroll error
    [errors_19.ScrollError.COULD_NOT_SCROLL]: 'Could not scroll page'
};
class FlowError extends Error {
    constructor(code, relatedError) {
        if (!exports.ErrorMessages[code]) {
            super(exports.ErrorMessages[errors_1.NodeError.UNKNOWN_ERROR]);
            logger_1.default.warn(`Missing error message for ${code}`);
            logger_1.default.error(new Error('Node error'), relatedError);
            this.code = errors_1.NodeError.UNKNOWN_ERROR;
            return;
        }
        super(exports.ErrorMessages[code]);
        this.code = code;
        if (relatedError) {
            logger_1.default.error(new Error('Node error'), relatedError);
        }
    }
}
exports.FlowError = FlowError;
//# sourceMappingURL=errors.js.map