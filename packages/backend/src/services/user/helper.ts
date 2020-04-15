import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { User } from 'models/user'

export const generateLoginToken = (user: User) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7 days' }
    )
}

export const generateRandomToken = async (length = 20) => {
    const buffer: Buffer = await new Promise((resolve, reject) => {
        crypto.randomBytes(length, (error, buffer) => {
            if (error) {
                reject(new Error('Error generating token'))
            }
            resolve(buffer)
        })
    })

    return buffer.toString('hex')
}

export const getReferralId = (userId: string) => {
    return userId.substr(userId.length - 5)
}
