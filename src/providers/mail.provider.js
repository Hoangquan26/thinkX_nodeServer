'use strict'
//import lib
// var Brevo = require('@getbrevo/brevo');
const Brevo = require('sib-api-v3-sdk')
//import config 
const configs = require('../configs/app.config') 
const MAIL_APIKEY = configs.MAIL_APIKEY
const MAIL_ADDRESS = configs.MAIL_ADDRESS
const MAIL_NAME = configs.MAIL_NAME

//import util
const { getVerificationLink, getVerificationContent, getVerificationSubject } = require('../common/templates/mail.template')

let defaultClient = Brevo.ApiClient.instance;

//set up api key
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = MAIL_APIKEY;

//create api instance
const apiInstance = new Brevo.TransactionalEmailsApi();
const sendMail = async({repicientEmail, subject, htmlContent}) => {
    //create api/mail instance
    const emailCampaigns = new Brevo.SendSmtpEmail(); 

    emailCampaigns.htmlContent = htmlContent
    emailCampaigns.subject = subject;
    emailCampaigns.sender = {"name": MAIL_NAME, "email": MAIL_ADDRESS};
    emailCampaigns.to = [{email: repicientEmail}]

    console.log(emailCampaigns)

    return apiInstance.sendTransacEmail(emailCampaigns)
}

const sendVerifyMail = async({repicientEmail, verifyToken}) => {
    const verificationLink = getVerificationLink({email: repicientEmail, verifyToken})
    const verificationSubject = getVerificationSubject()
    const verificationContent = getVerificationContent({verificationLink})
    return sendMail({repicientEmail, subject: verificationSubject, htmlContent: verificationContent})
}

module.exports = {
    sendMail,
    sendVerifyMail
}