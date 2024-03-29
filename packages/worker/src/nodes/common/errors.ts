export enum FileError {
    FILE_MISSING = 'FILE_MISSING',
    INVALID_FILE_PATH = 'INVALID_FILE_PATH',
    INVALID_FILE_NAME = 'INVALID_FILE_NAME',
    INVALID_DIRECTORY = 'INVALID_DIRECTORY',
    BUFFER_EMPTY = 'BUFFER_EMPTY'
}

export enum NodeError {
    NEEDS_ROOT_ANCESTOR = 'NEEDS_ROOT_ANCESTOR',
    NODE_NOT_FOUND = 'NODE_NOT_FOUND',
    NO_RESULT = 'NO_RESULT',
    TOO_MANY_CHILDREN = 'TOO_MANY_CHILDREN',
    NO_CHILDREN_ALLOWED = 'NO_CHILDREN_ALLOWED',
    NEEDS_PARENT = 'NEEDS_PARENT',
    CHILD_NODE_MISSING = 'CHILD_NODE_MISSING',
    NEEDS_REAL_BROWSER = 'NEEDS_REAL_BROWSER',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    TOO_MANY_ERRORS = 'TOO_MANY_ERRORS',
    EXPORT_NODE_MISSING = 'EXPORT_NODE_MISSING'
}

export enum ParseError {
    LINK_MISSING = 'LINK_MISSING',
    SELECTOR_MISSING = 'SELECTOR_MISSING',
    ERROR_RENDERING_HTML = 'ERROR_RENDERING_HTML',
    NO_SELECTOR_PARSER_FOUND = 'NO_SELECTOR_PARSER_FOUND',
    HTML_MISSING = 'HTML_MISSING',
    XML_PARSE_ERROR = 'XML_PARSE_ERROR',
    PAGE_MISSING = 'PAGE_MISSING',
    NO_DATA = 'NO_DATA'
}

export enum IntegrationError {
    INTEGRATION_MISSING = 'INTEGRATION_MISSING',
    INTEGRATION_INACTIVE = 'INTEGRATION_INACTIVE',
    ACCESS_TOKEN_MISSING = 'ACCESS_TOKEN_MISSING'
}
