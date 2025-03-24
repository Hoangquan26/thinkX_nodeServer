const appConfig = {
    dev: {
        PORT: process.env.DEV_APP_PORT,
        CONNECTION_STRING: process.env.DEV_MONGO
    },
    pro: {
        PORT: process.env.PRO_APP_PORT,
        CONNECTION_STRING: process.env.PRO_MONGO
    }
}

const env = process.env.NODE_ENV || "dev"

module.exports = appConfig[env]