'use strict';
// Import thư viện
const nodemailer = require('nodemailer');

// Import config
const configs = require('../configs/app.config');
const MAIL_HOST = configs.MAIL_HOST;
const MAIL_PORT = configs.MAIL_PORT;
const MAIL_USER = configs.MAIL_USER;
const MAIL_PASS = configs.MAIL_PASS;
const MAIL_ADDRESS = configs.MAIL_ADDRESS;
const MAIL_NAME = configs.MAIL_NAME;
// Import util
const { getVerificationLink, getVerificationContent, getVerificationSubject } = require('../common/templates/mail.template');

// Tạo transporter
const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_PORT == 465, 
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
});

const sendMail = async ({ recipientEmail, subject, htmlContent }) => {
    const mailOptions = {
        from: `"${MAIL_NAME}" <${MAIL_ADDRESS}>`,
        to: recipientEmail,
        subject: subject,
        html: htmlContent,
    };
    
    return transporter.sendMail(mailOptions);
};

const sendVerifyMail = async ({ recipientEmail, verifyToken }) => {
    console.log(recipientEmail, verifyToken)

    const verificationLink = getVerificationLink({ email: recipientEmail, verifyToken });
    const verificationSubject = getVerificationSubject();
    const verificationContent = getVerificationContent({ verificationLink });
    
    return sendMail({ recipientEmail, subject: verificationSubject, htmlContent: verificationContent });
};

module.exports = {
    sendMail,
    sendVerifyMail,
};
