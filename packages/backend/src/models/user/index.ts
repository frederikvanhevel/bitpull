import passportLocal from 'passport-local-mongoose'
import {
    PassportLocalDocument,
    Schema,
    model,
    PassportLocalSchema,
    Types
} from 'mongoose'
import { PaymentDocument } from 'models/payment'

export interface UserSettings {
    failedJobEmail: boolean
}

export interface User {
    _id: Types.ObjectId
    id: string
    email: string
    firstName: string
    lastName: string
    picture: string
    payment?: PaymentDocument['_id']
    resetPasswordToken?: string
    resetPasswordExpires?: Date
    verified: boolean
    verificationToken?: string
    deleted?: boolean
    settings: UserSettings
    referralId: string
}

export enum OAuthProvider {
    GOOGLE = 'GOOGLE'
}

export type UserDocument = User & PassportLocalDocument

const UserSchema: PassportLocalSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            index: true
        },
        firstName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        picture: String,
        payment: {
            type: Schema.Types.ObjectId,
            ref: 'Payment'
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        verified: {
            type: Boolean,
            default: false
        },
        verificationToken: String,
        // Google auth
        provider: String,
        providerId: String,
        deleted: Boolean,
        settings: {
            failedJobEmail: {
                type: Boolean,
                default: true
            }
        },
        referralId: String
    },
    {
        toJSON: {
            transform: (doc, ret) => {
                delete ret.salt
                delete ret.hash
            }
        },
        timestamps: true
    }
)

UserSchema.plugin(passportLocal, {
    usernameField: 'email',
    usernameQueryFields: ['email'],
    errorMessages: {
        IncorrectPasswordError: 'Password or email is incorrect',
        IncorrectUsernameError: 'Password or email is incorrect',
        MissingUsernameError: 'No email was given',
        UserExistsError: 'A user with the given email is already registered'
    }
})

const UserModel = model<UserDocument>('User', UserSchema)

export default UserModel
