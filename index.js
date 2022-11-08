'use strict';
const router = require('express').Router();
const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');

const Whatsapp = new WhatsappCloudAPI({
    accessToken: process.env.Meta_WA_accessToken,
    senderPhoneNumberId: process.env.Meta_WA_SenderPhoneNumberId,
    WABA_ID: process.env.Meta_WA_wabaId, 
    graphAPIVersion: 'v15.0'
});



router.get('/webhook', (req, res) => {
        console.log('GET: Someone is pinging me!');

        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        if (mode && token) {
  
            // Checks the mode and token sent is correct
            if (mode === 'subscribe' && token === Meta_WA_VerifyToken) {
              
              // Responds with the challenge token from the request
              console.log('WEBHOOK_VERIFIED');
              res.status(200).send(challenge);
            
            } else {
              // Responds with '403 Forbidden' if verify tokens do not match.
              res.sendStatus(403);      
            }
        }
        });

    
//meta_wa_callbackurl
router.post('/webhook', async (req, res) => {
   
   // console.log('POST: Someone is pinging me!');
    try {
        let data = Whatsapp.parseMessage(req.body);

        if (data?.isMessage) {
            let incomingMessage = data.message;
            let recipientPhone = incomingMessage.from.phone; // extract the phone number of sender
            let recipientName = incomingMessage.from.name;
            let typeOfMsg = incomingMessage.type; // extract the type of message (some are text, others are images, others are responses to buttons etc...)
            let message_id = incomingMessage.message_id; // extract the message id

        //Logic
        
            if(typeOfMsg === 'text_message'){
                await Whatsapp.sendText({
                    message:`Hi ${recipientName}, Thank you for contacting BestForU. In order to continue please enter your ID number.`,
                    recipientPhone: recipientPhone
                }

                )
            }
        }

        return res.sendStatus(200);
    } catch (error) {
                console.error({error})
        return res.sendStatus(500);
    }
});
module.exports = router;