'use strict';
const router = require('express').Router();
const { title } = require('process');
const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');

const Whatsapp = new WhatsappCloudAPI({
    accessToken: process.env.Meta_WA_accessToken,
    senderPhoneNumberId: process.env.Meta_WA_SenderPhoneNumberId,
    WABA_ID: process.env.Meta_WA_wabaId, 
    graphAPIVersion: 'v15.0'
});

router.get("/",(req,res)=>{
    res.status(200).send("Webhook working...");
});


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
        console.error({error})
        return res.sendStatus(500);
    }
});
//meta_wa_callbackurl
router.post('/webhook', async (req, res) => {
   
   // console.log('POST: Someone is pinging me!');
    try {
        let data = Whatsapp.parseMessage(req.body);

        console.log(JSON.stringify(data,null,2));

        if (data?.isMessage) {
            let incomingMessage = data.message;
            let recipientPhone = incomingMessage.from.phone; // extract the phone number of sender
            let recipientName = incomingMessage.from.name;
            let typeOfMsg = incomingMessage.type; // extract the type of message (some are text, others are images, others are responses to buttons etc...)
            let message_id = incomingMessage.message_id; // extract the message id

        //Logic
        let incomingTextMessage = incomingMessage.text.body;
        let filterID = incomingTextMessage.match(/^\d+$/); //if it has numbers 
           
        
        if(typeOfMsg === 'text_message'){
            if(filterID === null){
                await Whatsapp.sendText({
                    message:`Hi ${recipientName}, Welcome to BestForU self-service. In order to continue you are required to enter your ID.`,
                    recipientPhone: recipientPhone
                })
            }
        } 
        if(typeOfMsg === 'text_message') {
             if(filterID != null || filterID.length === 13){
                await Whatsapp.sendSimpleButtons({
                        message:`Hey ${recipientName}, Choose what operation do you want to perform`,
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
                  
              }
            }

            if(typeOfMsg === 'simple_button_message'){
                let buttonID = incomingMessage.button_reply.id;
              
                if(buttonID === 'id_Number'){
                    await Whatsapp.sendSimpleButtons({
                        message:`Hey ${recipientName}, Choose what operation do you want to perform`,
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
                }
            }
        }

        return res.sendStatus(200);
    } catch (error) {
                console.error({error})
        return res.sendStatus(500);
    }
});
module.exports = router;