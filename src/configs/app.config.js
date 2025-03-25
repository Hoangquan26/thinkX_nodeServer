const appConfig = {
    dev: {
        PORT: process.env.DEV_APP_PORT ?? 3006,
        CONNECTION_STRING: process.env.DEV_MONGO  ?? 3006,
        ENCODE_SALT: process.env.SALT ?? 10,
        PUBLIC_KEY: process.env.DEV_PUBLIC_KEY,
        PRIVATE_KEY: process.env.DEV_PRIVATE_KEY
        
    },
    pro: {
        PORT: process.env.PRO_APP_PORT  ?? 3006,
        CONNECTION_STRING: process.env.PRO_MONGO  ?? 3006,
        ENCODE_SALT: process.env.SALT ?? 10,
        PUBLIC_KEY: process.env.PRO_PUBLIC_KEY,
        PRIVATE_KEY: process.env.PRO_PRIVATE_KEY
    }
}

const env = process.env.NODE_ENV || "dev"

module.exports = appConfig[env]