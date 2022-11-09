const production = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'production',
   // PORT: '9000',
    Meta_WA_accessToken:'EAALY24IFZABUBAC4wDWSnDwVrJl2kJ8wVz9vPVRP5JxjDPFhkxRsASkZCc0DdnZA8VK87KgbYYX9ZCiRhZBqIe6jOGKXe7DqLZCbImjDxeZCV7uItfSPeVtlUaUVG1vQvZBZCeKGN2S2nhso1b9L8iEIg9zsY3SdBlNRHEZCXpTUOXWfOf3fxtVFzcQxOjHZBlePEDfid8McAowb5e9HBNHatNw',
    Meta_WA_SenderPhoneNumberId: '100501282880988',
    Meta_WA_wabaId: '110726525175448',
    Meta_WA_VerifyToken: 'APS',
};

const development = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: '9000',
    Meta_WA_accessToken:'EAALY24IFZABUBAF6cUo1HqskEuH7AXk8dQZBYVcuAfZCfzbueliUaLx4ytbxPZAkdmNDJ7SakZB3eUoSZCjVZC36RO0DqRCU82tRLSROgGSIe2gR4hZBYV8K3LMORsptRx68gnXbGdex6JKzZCWSvW6qRGZAffVI1CMW4OhLnzVnXnUbwsVYZC7G8EfnCTtVE5EfEaQm4WoUJEJmrU2WUn1Iyty',
    Meta_WA_SenderPhoneNumberId: '100501282880988',
    Meta_WA_wabaId: '110726525175448',
    Meta_WA_VerifyToken: 'APS',
};

const fallback = {
    ...process.env,
    NODE_ENV: undefined,
};

module.exports = (environment) => {
    console.log(`Execution environment selected is: "${environment}"`);
    if (environment === 'production') {
        return production;
    } else if (environment === 'development') {
        return development;
    } else {
        return fallback;
    }
};