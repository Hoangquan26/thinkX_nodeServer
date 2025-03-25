const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const { NotFoundError } = require('./common/responses/errorReponse')
const app = express()

//define env config
require('dotenv').config();

//initial middleware
app.use(morgan('dev'))
app.use(compression())
app.use(helmet())
app.use(express.json())

//initial database
require('./dbs/init.mongoose')

//initial routers
app.use('/v1', require('./routers/v1/index'))

//catch error
app.use((req, res, next) => {
    const message = "Not found"
    next(new NotFoundError(message))
})

app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    return res.status(500).json({
        message: err.message || 'Internal Server Error',
        status: 'error',
        statusCode: statusCode
    })
})

module.exports = app