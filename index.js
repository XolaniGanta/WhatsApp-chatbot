'use strict';
const {Sequelize, DataTypes} = require("sequelize");
const router = require('express').Router();
require('dotenv').config()

///const dbRoute = require('./db')
const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');

const Whatsapp = new WhatsappCloudAPI({
    accessToken: process.env.Meta_WA_accessToken,
    senderPhoneNumberId: process.env.Meta_WA_SenderPhoneNumberId,
    WABA_ID: process.env.Meta_WA_wabaId,
    graphAPIVersion: 'v15.0'
});

///Db Connection
const sequelize = new Sequelize(
    'thinkadamdb',
    'root',
    'password',
     {
       host: 'localhost',
       dialect: 'mysql'
     }
   );

// database logic
 sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });
     
    const allrequests = sequelize.define(
       "allrequests",{
         id_type: DataTypes.TEXT
       },
       {
         createdAt: false,
         updatedAt: false
       }
     );

 const results = allrequests.findAll({
        where:{
              id_type: "SerialNumber"
        },
        limit: 5,
      });
   
router.get("/", (req, res) => {
    res.status(200).send("Webhook working...");
});

router.get('/webhook', (req, res) => {
    try {
        console.log('Doing a get request!');
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        if (
            mode &&
            token &&
            mode === 'subscribe' &&
            process.env.Meta_WA_VerifyToken === token
        ) {
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    } catch (error) {
        console.error({ error })
        return res.sendStatus(500);
    }
});
router.post('/webhook', async (req, res) => {
    try {
        let data = Whatsapp.parseMessage(req.body);
      //  console.log(JSON.stringify(data, null, 2));

        if (data?.isMessage) {
            let incomingMessage = data.message;
            let recipientPhone = incomingMessage.from.phone; // extract the phone number of sender
            let recipientName = incomingMessage.from.name;
            let typeOfMsg = incomingMessage.type; // extract the type of message (some are text, others are images, others are responses to buttons etc...)
            let message_id = incomingMessage.message_id; // extract the message id
            
            //IF else logic 
            if (typeOfMsg === 'text_message') {
                let incomingTextMessage = incomingMessage.text.body;
                let filterID = incomingTextMessage.match(/^\d+$/); //if it has numbers 
                if (filterID === null) {
                    await Whatsapp.sendText({
                        message: results,
                        recipientPhone: recipientPhone
                    })
                }
            } 
            if (typeOfMsg === 'text_message') {
                let incomingTextMessage = incomingMessage.text.body;
                let count = incomingTextMessage.length; // length of the ID
                let filterID = incomingTextMessage.match(/^\d+$/); //extracting digits
                if (filterID != null && count === 13 ) {
                    await Whatsapp.sendSimpleButtons({
                        message: `Choose what operation do you want to perform`,
                        recipientPhone: recipientPhone,
                        listOfButtons: [{
                            title: 'Pay your account',
                            id: 'pay_account'
                        },
                        {
                            title: 'Check balance',
                            id: 'check_balance'
                        }
                        ]
                    })

                } else if(filterID != null){
                    await Whatsapp.sendText({
                        message: `${recipientName} seems you've entered a wrong id number, please check and enter again.  `,
                        recipientPhone: recipientPhone
                    })
                }
            }
            
            //if the pay account is pressed
            if (typeOfMsg === 'simple_button_message') {
                let buttonID = incomingMessage.button_reply.id;
                if (buttonID === 'pay_account') {
                    await Whatsapp.sendSimpleButtons({
                        message: `Choose which account to settle`,
                        recipientPhone: recipientPhone,
                        listOfButtons: [{
                            title: 'Sim Only',
                            id: 'Sim_Only'
                        },
                        {
                            title: 'Ulefone',
                            id: 'Ulefone_id'
                        },
                        {
                            title: 'Pinnacle data',
                            id: 'pinnacle_data'
                        }

                        ]
                        
                    })
                }
            }
            
            if(typeOfMsg === 'simple_button_message'){
                let buttonID = incomingMessage.button_reply.id;
                if (buttonID === 'check_balance'){
                    await Whatsapp.sendDocument({
                        recipientPhone: recipientPhone,
                        caption: 'Download your pdf statement!\nTo perform another transcation please re-enter your id nuumber',
                        url: 'http://pdfkit.org/demo/out.pdf',
                    })
                }
            }
            
            if (typeOfMsg === 'simple_button_message') {
                let buttonID = incomingMessage.button_reply.id;
                if (buttonID === 'Sim_Only') {
                    await Whatsapp.sendSimpleButtons({
                        message: `CHECKOUT:\nYou have chosen to settle the Sim only contract\nPress the continue button to make your payment`,
                        recipientPhone: recipientPhone,
                        listOfButtons: [
                            {
                                title: 'Continue',
                                id: 'check_out'
                            }
                        ]
                    })
                }
            }
            await Whatsapp.markMessageAsRead({
                message_id,
            });
        }

        return res.sendStatus(200);
    } catch (error) {
        console.error({ error })
        return res.sendStatus(500);
    }
});
module.exports = router;