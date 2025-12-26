import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { StripePlugin } from '@vendure/payments-plugin/package/stripe';
import 'dotenv/config';
import path from 'path';

const isDev = process.env.APP_ENV === 'dev';

export const config: VendureConfig = {
    apiOptions: {
        port: +(process.env.PORT || 3000),
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        cors: {
            origin: [
                'http://localhost:3000',
                'https://lenda-camisetas.up.railway.app',
                process.env.STOREFRONT_URL || 'https://sua-loja-front.vercel.app',
            ],
            credentials: true,
        },
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME!,
            password: process.env.SUPERADMIN_PASSWORD!,
        },
        cookieOptions: {
            secret: process.env.COOKIE_SECRET!,
        },
    },
    dbConnectionOptions: {
        type: 'postgres',
        synchronize: true,
        logging: false,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT!,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    customFields: {},
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: process.env.ASSET_VOLUME_PATH || path.join(__dirname, '../static/assets'),
            assetUrlPrefix: isDev ? undefined : `https://${process.env.PUBLIC_DOMAIN}/assets/`,
        }),
        StripePlugin.init({
            storeCustomersInStripe: true,
        }),
        DefaultSchedulerPlugin.init(),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        
        EmailPlugin.init({
            handlers: defaultEmailHandlers,
            templatePath: path.join(__dirname, '../static/email/templates'),
            transport: {
                type: 'smtp',
                host: process.env.SMTP_HOST,
                port: 587,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
                logging: true,
                debug: true,
            },
            globalTemplateVars: {
                fromAddress: '"Lenda Camisetas" <camisetas.lenda@gmail.com>',
                verifyEmailAddressUrl: 'https://lenda-camisetas.up.railway.app/verify',
                passwordResetUrl: 'https://lenda-camisetas.up.railway.app/password-reset',
                changeEmailAddressUrl: 'https://lenda-camisetas.up.railway.app/verify-email-address-change'
            },
        }),

        AdminUiPlugin.init({
            route: 'admin',
            port: 3002,
        }),
    ],
};