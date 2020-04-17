"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileError;
(function (FileError) {
    FileError["FILE_MISSING"] = "FILE_MISSING";
    FileError["INVALID_FILE_PATH"] = "INVALID_FILE_PATH";
    FileError["INVALID_FILE_NAME"] = "INVALID_FILE_NAME";
    FileError["INVALID_DIRECTORY"] = "INVALID_DIRECTORY";
    FileError["BUFFER_EMPTY"] = "BUFFER_EMPTY";
})(FileError = exports.FileError || (exports.FileError = {}));
var NodeError;
(function (NodeError) {
    NodeError["NEEDS_ROOT_ANCESTOR"] = "NEEDS_ROOT_ANCESTOR";
    NodeError["NODE_NOT_FOUND"] = "NODE_NOT_FOUND";
    NodeError["NO_RESULT"] = "NO_RESULT";
    NodeError["TOO_MANY_CHILDREN"] = "TOO_MANY_CHILDREN";
    NodeError["NO_CHILDREN_ALLOWED"] = "NO_CHILDREN_ALLOWED";
    NodeError["NEEDS_PARENT"] = "NEEDS_PARENT";
    NodeError["CHILD_NODE_MISSING"] = "CHILD_NODE_MISSING";
    NodeError["NEEDS_REAL_BROWSER"] = "NEEDS_REAL_BROWSER";
    NodeError["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    NodeError["TOO_MANY_ERRORS"] = "TOO_MANY_ERRORS";
    NodeError["EXPORT_NODE_MISSING"] = "EXPORT_NODE_MISSING";
})(NodeError = exports.NodeError || (exports.NodeError = {}));
var ParseError;
(function (ParseError) {
    ParseError["LINK_MISSING"] = "LINK_MISSING";
    ParseError["SELECTOR_MISSING"] = "SELECTOR_MISSING";
    ParseError["ERROR_RENDERING_HTML"] = "ERROR_RENDERING_HTML";
    ParseError["NO_SELECTOR_PARSER_FOUND"] = "NO_SELECTOR_PARSER_FOUND";
    ParseError["HTML_MISSING"] = "HTML_MISSING";
    ParseError["XML_PARSE_ERROR"] = "XML_PARSE_ERROR";
})(ParseError = exports.ParseError || (exports.ParseError = {}));
var IntegrationError;
(function (IntegrationError) {
    IntegrationError["INTEGRATION_MISSING"] = "INTEGRATION_MISSING";
    IntegrationError["INTEGRATION_INACTIVE"] = "INTEGRATION_INACTIVE";
    IntegrationError["ACCESS_TOKEN_MISSING"] = "ACCESS_TOKEN_MISSING";
})(IntegrationError = exports.IntegrationError || (exports.IntegrationError = {}));
//# sourceMappingURL=errors.js.map