'use strict'

//import configs
const configs = require('../../configs/app.config')
const WEBSITE_DOMAIN = configs.WEBSITE_DOMAIN ?? 'http://localhost:5173'

const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email={{{email}}}&token={{{verifyToken}}}`
const verificationSubject = 'ThinkX Edu Appilication: Please verify your account to using out service'
const verifyHTMLContent = `
    <h3>Click <a href="{{{verificationLink}}}">here</a> to verify your account : "{{{verificationLink}}}"</h3>    
`

const getVerificationLink = ({email, verifyToken}) => {
    return verificationLink.replace('{{{email}}}', email).replace('{{{verifyToken}}}', verifyToken)
}

const getVerificationSubject = () => verificationSubject

const getVerificationContent = ({verificationLink}) => {
    return verifyHTMLContent.replace('{{{verificationLink}}}', verificationLink).replace('{{{verificationLink}}}', verificationLink)
}
module.exports = {
    getVerificationLink,
    getVerificationSubject,
    getVerificationContent
}