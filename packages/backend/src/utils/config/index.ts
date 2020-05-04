import { Environment } from './typedefs'

const required: Partial<Environment> = {
    NODE_ENV: process.env.NODE_ENV!,
    MONGO_URI: process.env.MONGO_URI!,
    API_URL: process.env.API_URL!,
    APP_URL: process.env.APP_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY!,
    RUNNER_TIMEOUT: parseInt(process.env.RUNNER_TIMEOUT! || '900000'),
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY!,
    DROPBOX_CLIENT_ID: process.env.DROPBOX_CLIENT_ID!,
    DROPBOX_CLIENT_SECRET: process.env.DROPBOX_CLIENT_SECRET!,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID!,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    ONEDRIVE_CLIENT_ID: process.env.ONEDRIVE_CLIENT_ID!,
    ONEDRIVE_CLIENT_SECRET: process.env.ONEDRIVE_CLIENT_SECRET!,
    SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID!,
    SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET!,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET!,
    SEGMENT_WRITE_KEY: process.env.SEGMENT_WRITE_KEY!,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    TRIAL_CREDIT_AMOUNT: parseInt(process.env.TRIAL_CREDIT_AMOUNT! || '300')
}

// @ts-ignore
const Config: Environment = {
    ...required,
    PUPPETEER_ENDPOINT: process.env.PUPPETEER_ENDPOINT
}

export const getMissingVars = () => {
    const missing = []

    for (const key of Object.keys(required)) {
        // @ts-ignore
        if (!Config[key]) missing.push(key)
    }

    return missing
}

export default Config
