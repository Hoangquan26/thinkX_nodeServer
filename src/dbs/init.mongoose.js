'use strict'
const mongoose = require('mongoose')
const appConfig = require('../configs/app.config')
const DatabaseType = {
    MONGO: 'mongo',
    MYSQL: 'mysql'
}



class Database {
    constructor() {
        this.connect()
    }

    connect(type = DatabaseType.MONGO) {
        //define dev or product
        if(1 == 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }
        mongoose.connect(appConfig.CONNECTION_STRING)
        .then(_ => {
            console.log(`Connected MongoDb By Mongoose`)
        })
        .catch(err => {
            console.error(`Conntect to mongo fail\nError: ${err}`)
        })
    }

    static getInstance = () => {
        if(!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instaceMongoDb = Database.getInstance()
return instaceMongoDb