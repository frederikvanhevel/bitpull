export enum WebhookEvent {
    PAYMENT_FAILED = 'invoice.payment_failed',
    PAYMENT_SUCCEEDED = 'invoice.payment_succeeded',
    SUBSCRIPTION_DELETED = 'customer.subscription.deleted',
    TRIAL_WILL_END = 'customer.subscription.trial_will_end'
}
