import crypto from 'crypto'

export enum EncyptionAlgorithm {
    v1 = 'aes-256-ctr'
}

export const isEncryptionVersionSupported = (version: string) => {
    return Object.keys(EncyptionAlgorithm).includes(version)
}

export const decrypt = (
    key: string,
    text: string,
    algorithm: string = 'v1'
) => {
    const alg = (EncyptionAlgorithm as any)[algorithm]
    const decipher = crypto.createDecipher(alg, key)
    let decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}
