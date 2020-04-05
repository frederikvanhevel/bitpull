import { mocked } from 'ts-jest/utils'
import UserModel from 'models/user'

jest.mock('models/user')
const mockedUserModel = mocked(UserModel)

describe('User service', () => {
    it('should login', async () => {})

    it('should generate and send verification token', async () => {})

    it('should register', async () => {})

    it('should register or login via oauth', async () => {})

    it('should get a user', async () => {})

    it('should send a forgot password email', async () => {})

    it('should reset password', async () => {})

    it('should update user information', async () => {})

    it('should verify email', async () => {})

    it('should get a referral link', async () => {})

    it('should cancel an account', async () => {})

    it('should update user settings', async () => {})
})
