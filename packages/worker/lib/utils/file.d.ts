export declare enum FileType {
    JSON = "json",
    EXCEL = "xls",
    PDF = "pdf",
    CSV = "csv",
    PNG = "png"
}
export declare enum FileEncoding {
    UTF8 = "utf8",
    BINARY = "binary",
    BASE64 = "base64"
}
export interface FileWriteResult {
    path: string;
    fileName: string;
    encoding?: FileEncoding;
    contentType: string;
}
export declare const writeFile: (content: any, type: FileType, encoding?: FileEncoding) => Promise<string>;
export declare const readFile: (path: string, encoding: FileEncoding) => Promise<unknown>;
export declare const validateFilePath: (path: string) => boolean;
export declare const getFileNameFromPath: (path: string) => string;
export declare const parseXml: (body: string) => Promise<any>;
