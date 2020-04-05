import { Settings } from '../../typedefs/common';
import { EmailOptions } from './typedefs';
export declare const SUPPORT_EMAIL_ADDRESS = "help@bitpull.io";
export declare const Senders: {
    Bitpull: {
        email: string;
        name: string;
    };
};
export declare const sendMail: (options: EmailOptions, settings: Settings) => Promise<[import("@sendgrid/client/src/response").ClientResponse, {}]> | undefined;
