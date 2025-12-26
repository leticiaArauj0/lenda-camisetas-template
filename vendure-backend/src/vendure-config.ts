import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin, EmailPluginDevModeOptions, EmailPluginOptions } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { StripePlugin } from '@vendure/payments-plugin/package/stripe';
import 'dotenv/config';
import path from 'path';

const isDev: Boolean = process.env.APP_ENV === 'dev';

// Configuração unificada do Email Plugin
const emailPluginOptions = process.env.SMTP_HOST ? {
    transport: {
        type: 'smtp',
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        logging: true,
    },
    templatePath: path.join(__dirname, '../static/email/templates'),
    globalTemplateVars: {
        fromAddress: '"Lenda Camisetas" <camisetas.lenda@gmail.com>',
        verifyEmailAddressUrl: 'https://lenda-camisetas.up.railway.app/verify',
        passwordResetUrl: 'https://lenda-camisetas.up.railway.app/password-reset',
        changeEmailAddressUrl: 'https://lenda-camisetas.up.railway.app/verify-email-address-change'
    },
} : {
    // Modo DEV (Local)
    devMode: true,
    outputPath: path.join(__dirname, '../static/email/test-emails'),
    route: 'mailbox',
    templatePath: path.join(__dirname, '../static/email/templates'),
    globalTemplateVars: {
        fromAddress: '"Lenda Camisetas Local" <dev@lendacamisetas.com>',
        verifyEmailAddressUrl: 'http://localhost:3000/verify',
    },
};

export const config: VendureConfig = {
    apiOptions: {
        port: +(process.env.PORT || 3000),
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        cors: {
            origin: [
                'http://localhost:3000',
                'http://localhost:8002',
                'http://localhost:4200',
                process.env.PUBLIC_DOMAIN ? `https://${process.env.PUBLIC_DOMAIN}` : 'https://lenda-camisetas-production.up.railway.app',
                'https://lenda-camisetas.up.railway.app' // Adicionei a URL do front por garantia
            ],
            credentials: true,
        },
        ...(isDev ? {
            adminApiPlayground: { settings: { 'request.credentials': 'include' } },
            adminApiDebug: true,
            shopApiPlayground: { settings: { 'request.credentials': 'include' } },
            shopApiDebug: true,
        } : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
        cookieOptions: {
            secret: process.env.COOKIE_SECRET,
        },
    },
    dbConnectionOptions: {
        type: 'postgres',
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
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
            paymentIntentCreateParams: (injector, ctx, order) => {
                return {
                    description: `Order #${order.code} for ${order.customer?.emailAddress}`
                };
            }
        }),
        DefaultSchedulerPlugin.init(),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        
        EmailPlugin.init({
            ...emailPluginOptions,
            handlers: defaultEmailHandlers,
        } as EmailPluginOptions | EmailPluginDevModeOptions),
        
        AdminUiPlugin.init({
            route: 'admin',
            port: 3002,
            adminUiConfig: {
                apiHost: isDev ? undefined : `https://${process.env.PUBLIC_DOMAIN}`,
                apiPort: isDev ? +(process.env.PORT || 3000) : undefined,
            },
        }),
    ],
};