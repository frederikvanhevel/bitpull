import EncryptionSerivce from '../index'

describe('Encryption service', () => {
    it('should encrypt a string', async () => {
        const encrypted = EncryptionSerivce.encrypt('hello world')
        expect(encrypted).toEqual('3295189f8f63b8b37f5c83')
    })

    it('should decrypt a string', async () => {
        const decrypted = EncryptionSerivce.decrypt('3295189f8f63b8b37f5c83')
        expect(decrypted).toEqual('hello world')
    })
})
