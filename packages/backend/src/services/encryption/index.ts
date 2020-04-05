import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!
const ALGORITHM = 'aes-256-ctr'

const encrypt = (text: string) => {
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
}

const decrypt = (text: string) => {
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY)
    let decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

const EncryptionSerivce = {
    encrypt,
    decrypt
}

export default EncryptionSerivce
