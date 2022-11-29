const production = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'production',
   // PORT: '9000',
    Meta_WA_accessToken:'EAALY24IFZABUBAKkZAhjMK0ncvf7nxMFVATobEAVV83NvJCloCKdwokW3vbgVAZAYsQ3Lchvq6vAo9ktPappWpLHcHIJaouOT0lZBtqKrNZC6r6ijZBnrtgrzZAwLoCVbDHY9ZBXkxteY1oMx58kNT7DqcNVysh0TzAf7pCLPaX06hFzAxrOMs2uYDiJeUpPWttJJ49qq1aRs1M8BVQmmF0l',
    Meta_WA_SenderPhoneNumberId: '100501282880988',
    Meta_WA_wabaId: '110726525175448',
    Meta_WA_VerifyToken: 'APS',
};
const development = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: '9000',
    Meta_WA_accessToken:'EAALY24IFZABUBAGYf0wvMBosmAS1Kogsl7zjUzFUqFrlwZArJxFOJeh4VZAww3vVo0HBNX80Yl2vwQuAczBm35ljJ8UxZBvzaUSfvPZBlR3v0fv9D59Fi5pPW2yQlMvZAlpHIgg6EAoGOQeHIK4LznYicSQtu3tnZBjAip1d1QNNABbjZAs2S4ZCcF48n3JbhF2Um3XhTMztRw3B1EWNXXLdj',
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