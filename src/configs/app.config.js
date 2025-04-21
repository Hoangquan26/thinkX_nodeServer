const appConfig = {
    dev: {
        PORT: process.env.DEV_APP_PORT ?? 3006,
        CONNECTION_STRING: process.env.DEV_MONGO  ?? 3006,
        WEBSITE_DOMAIN: process.env.DEV_WEBSITE_DOMAIN,
        ENCODE_SALT: process.env.SALT ?? 10,
        PUBLIC_KEY: process.env.DEV_PUBLIC_KEY,
        PRIVATE_KEY: process.env.DEV_PRIVATE_KEY,
        MAIL_APIKEY: process.env.DEV_MAIL_APIKEY,
        MAIL_ADDRESS: process.env.DEV_MAIL_ADDRESS,
        MAIL_NAME: process.env.DEV_MAIL_NAME,
        MAIL_HOST: process.env.MAIL_HOST || "smtp.gmail.com",
        MAIL_PORT: process.env.MAIL_PORT || 587,
        MAIL_USER: process.env.MAIL_USER || "your-email@gmail.com",
        MAIL_PASS: process.env.MAIL_PASS || "your-email-password",
        //mail using brevo thirf party service
    },
    pro: {
        PORT: process.env.PRO_APP_PORT  ?? 3006,
        CONNECTION_STRING: process.env.PRO_MONGO  ?? 3006,
        WEBSITE_DOMAIN: process.env.PRO_WEBSITE_DOMAIN,
        ENCODE_SALT: process.env.SALT ?? 10,
        PUBLIC_KEY: process.env.PRO_PUBLIC_KEY,
        PRIVATE_KEY: process.env.PRO_PRIVATE_KEY,
        MAIL_APIKEY: process.env.PRO_MAIL_APIKEY,
        MAIL_ADDRESS: process.env.PRO_MAIL_ADDRESS,
        MAIL_NAME: process.env.PRO_MAIL_NAME,
        MAIL_HOST: process.env.MAIL_HOST || "smtp.gmail.com",
        MAIL_PORT: process.env.MAIL_PORT || 587,
        MAIL_USER: process.env.MAIL_USER || "your-email@gmail.com",
        MAIL_PASS: process.env.MAIL_PASS || "your-email-password",
    }
}

const env = process.env.NODE_ENV || "dev"

module.exports = appConfig[env]