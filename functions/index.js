//Imports : 
const functions = require('firebase-functions');
const express = require('express')
const { body, validationResult } = require('express-validator');
const cors = require("cors");
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

admin.initializeApp();

const app = express();

//Middleware mostly to parse json and string objects and to cross origin requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true }));



const gmailEmail = functions.config().transporter_config.email;
const gmailPassword = functions.config().transporter_config.password;

//creating function for sending emails
var goMail = function(content) {

    //Email middleman
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailEmail,
            pass: gmailPassword
        }
    });


    const mailOptions = {
        from: content.data.email,
        cc: content.data.email,
        to: "agabt077@gmail.com",
        subject: "RFTC contact Form : " + content.data.name + " @ <" + content.data.email + ">",
        text: content.data.message,
    };

    const getDeliveryStatus = function(error, info) {
        if (error) {
            return console.log(error);
        }
        //console.log('Message sent: %s', info.messageId);
    };

    transporter.sendMail(mailOptions, getDeliveryStatus);
};


app.get('/', (req, res) => {
    res.send('RFTC contact service');
});

//TODO : Complete response messages redirection 
app.post('/contact_me',
    (req, res) => {
        console.log("BODY INCOMING");

        console.log(req.body.data.email);

        goMail(req.body);

        res.send({ data: "success" });
    });


const api1 = functions.https.onRequest((request, response) => {

    return app(request, response)
})

module.exports = {
    api1
}