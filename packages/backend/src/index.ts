import dotenv from 'dotenv'
dotenv.config()
import { startServer } from 'server'
import Scheduler from 'components/scheduler'

const requiredVars = [
    'API_URL',
    'APP_URL',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'GROWSURF_API_TOKEN',
    'GROWSURF_CAMPAIGN_ID',
    'GROWSURF_WEBHOOK_SECRET',
    'DATABASE_URI',
    'SLACK_CLIENT_ID',
    'SLACK_CLIENT_SECRET',
    'DROPBOX_CLIENT_ID',
    'DROPBOX_CLIENT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'ONEDRIVE_CLIENT_ID',
    'ONEDRIVE_CLIENT_SECRET',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'AWS_REGION',
    'AWS_S3_BUCKET',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'SENDGRID_API_KEY',
    'SEGMENT_WRITE_KEY',
    'EMAIL_FROM_ADDRESS'
]

const missingVars: string[] = requiredVars.filter(
    envVar => !process.env[envVar]
)

if (missingVars.length) {
    throw new Error(`${missingVars.join(' ')} variables are missing`)
}

Scheduler.start()

export default startServer()
