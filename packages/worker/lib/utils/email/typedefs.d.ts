export interface NotificationParams {
    message: string;
    metaData?: object;
}
export interface EmailOptions {
    to: string;
    from?: {
        name: string;
        email: string;
    };
    params?: NotificationParams;
}
