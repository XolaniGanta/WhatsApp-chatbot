'use strict';
const router = require('express').Router();
const { title } = require('process');
const mysql = require("mysql2");
const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');

const Whatsapp = new WhatsappCloudAPI({
    accessToken: process.env.Meta_WA_accessToken,
    senderPhoneNumberId: process.env.Meta_WA_SenderPhoneNumberId,
    WABA_ID: process.env.Meta_WA_wabaId,
    graphAPIVersion: 'v15.0'
});

const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'blc'
});


router.get("/", (req, res) => {
    res.status(200).send("Webhook working...");
});

con.connect((err)=>{
        if(err){
        console.log(err)
        }else{
            console.log("Database connected...")
        }
    })

    con.query('SELECT created_time FROM blc.operations WHERE id=1',(err,result) =>{
        if(err){
            console.log(err)
        }else{
            console.log(result)
        }
    })


router.get('/webhook', (req, res) => {
    try {
        console.log('GET: Someone is pinging me!');


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

        console.log(JSON.stringify(data, null, 2));

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
                        message: `Hi ${recipientName}, Welcome to BestForU self-service. In order to continue you are required to enter your ID.`,
                        recipientPhone: recipientPhone
                    })
                }
            }
            if (typeOfMsg === 'text_message') {
                let incomingTextMessage = incomingMessage.text.body;
                let filterID = incomingTextMessage.match(/^\d+$/); //if it has numbers 
                if (filterID != null ) {
                    await Whatsapp.sendSimpleButtons({
                        message: `Choose what operation do you want to perform`,
                        recipientPhone: recipientPhone,
                        listOfButtons: [{
                            title: 'Pay your account',
                            id: 'pay_account'
                        },
                        {
                            title: 'Get statements',
                            id: 'get_statements'
                        },
                        {
                            title: 'Check balance',
                            id: 'check_balance'
                        }

                        ]
                    })

                }else if(filterID.length != 13){
                    await Whatsapp.sendText({
                        message:`Invalid ID number. Please enter ID again`,
                        recipientPhone: recipientPhone

                    })
                }
            }

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

            if (typeOfMsg === 'simple_button_message') {
                let buttonID = incomingMessage.button_reply.id;
                if (buttonID === 'Sim_Only') {
                    await Whatsapp.sendSimpleButtons({
                        message: `Continue to check out page to finish your payment`,
                        recipientPhone: recipientPhone,
                        listOfButtons: [
                            {
                                title: 'Checkout',
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