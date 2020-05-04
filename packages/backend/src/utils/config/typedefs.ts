export interface Environment {
    NODE_ENV: string
    MONGO_URI: string
    API_URL: string
    APP_URL: string
    PUPPETEER_ENDPOINT: string | undefined
    JWT_SECRET: string
    ENCRYPTION_KEY: string
    RUNNER_TIMEOUT: number
    SENDGRID_API_KEY: string
    DROPBOX_CLIENT_ID: string
    DROPBOX_CLIENT_SECRET: string
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    ONEDRIVE_CLIENT_ID: string
    ONEDRIVE_CLIENT_SECRET: string
    SLACK_CLIENT_ID: string
    SLACK_CLIENT_SECRET: string
    AWS_ACCESS_KEY_ID: string
    AWS_SECRET_ACCESS_KEY: string
    AWS_S3_BUCKET: string
    SEGMENT_WRITE_KEY: string
    STRIPE_SECRET_KEY: string
    STRIPE_WEBHOOK_SECRET: string
    TRIAL_CREDIT_AMOUNT: number
}
