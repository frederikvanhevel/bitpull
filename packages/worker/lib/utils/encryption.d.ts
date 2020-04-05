export declare enum EncyptionAlgorithm {
    v1 = "aes-256-ctr"
}
export declare const isEncryptionVersionSupported: (version: string) => boolean;
export declare const decrypt: (key: string, text: string, algorithm?: string) => string;
