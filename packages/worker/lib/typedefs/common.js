"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogType;
(function (LogType) {
    LogType["INFO"] = "INFO";
    LogType["ERROR"] = "ERROR";
    LogType["WARN"] = "WARN";
})(LogType = exports.LogType || (exports.LogType = {}));
var StorageService;
(function (StorageService) {
    StorageService["NATIVE"] = "NATIVE";
    StorageService["DROPBOX"] = "DROPBOX";
    StorageService["GOOGLE_DRIVE"] = "GOOGLE_DRIVE";
    StorageService["ONEDRIVE"] = "ONEDRIVE";
    StorageService["GITHUB"] = "GITHUB";
})(StorageService = exports.StorageService || (exports.StorageService = {}));
var IntegrationType;
(function (IntegrationType) {
    IntegrationType["SLACK"] = "SLACK";
    IntegrationType["DROPBOX"] = "DROPBOX";
    IntegrationType["GOOGLE_DRIVE"] = "GOOGLE_DRIVE";
    IntegrationType["ONEDRIVE"] = "ONEDRIVE";
    IntegrationType["GITHUB"] = "GITHUB";
})(IntegrationType = exports.IntegrationType || (exports.IntegrationType = {}));
var StorageProvider;
(function (StorageProvider) {
    StorageProvider["NONE"] = "NONE";
    StorageProvider["AMAZON"] = "AMAZON";
})(StorageProvider = exports.StorageProvider || (exports.StorageProvider = {}));
var Status;
(function (Status) {
    Status["UNDETERMINED"] = "UNDETERMINED";
    Status["SUCCESS"] = "SUCCESS";
    Status["PARTIAL_SUCCESS"] = "PARTIAL_SUCCESS";
    Status["ERROR"] = "ERROR";
})(Status = exports.Status || (exports.Status = {}));
//# sourceMappingURL=common.js.map