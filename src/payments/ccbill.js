/**
 * THE VAULT - Financial Intelligence Unit (CCBill Integration)
 * Logic: Validate the transaction, update the vault, and trigger the "Unlock"
 */

const crypto = require('crypto'); // Built-in Node tool to verify security hashes

const CCBillManager = {
    // These keys come from your CCBill Account (Keep them in .env, never hardcode!)
    salt: process.env.CCBILL_SALT, 
    clientAccNo: process.env.CCBILL_ACC_NO,
    clientSubAccNo: process.env.CCBILL_SUB_ACC,

    /**
     * 1. CREATE THE PAYMENT LINK
     * Generates a secure, encrypted URL to send the user to the checkout.
     */
    generatePaymentURL: function(videoId, price) {
        // We create a 'Digest' to prove to CCBill that the price hasn't been tampered with
        const formPrice = price.toFixed(2);
        const currencyCode = '840'; // USD
        const period = '30'; // Access for 30 days
        
        const hash = crypto.createHash('md5')
            .update(formPrice + period + currencyCode + this.salt)
            .digest('hex');

        return `https://bill.ccbill.com/jpost/signup.cgi?clientAccNo=${this.clientAccNo}&clientSubAccNo=${this.clientSubAccNo}&formPrice=${formPrice}&formPeriod=${period}&currencyCode=${currencyCode}&formDigest=${hash}&videoId=${videoId}`;
    },

    /**
     * 2. THE MONEY WEBHOOK (Postback)
     * This is the "Ping" from CCBill telling your site: "The Money is in the Bank."
     */
    handlePostback: function(req, res) {
        const { transactionId, videoId, status, responseDigest } = req.body;

        // SECURITY CHECK: Verify this message actually came from CCBill
        const myCheckHash = crypto.createHash('md5')
            .update(transactionId + '1' + this.salt) // '1' is the CCBill code for success
            .digest('hex');

        if (responseDigest !== myCheckHash) {
            console.error("ALERT: Fraudulent payment attempt detected!");
            return res.status(403).send('Invalid Hash');
        }

        if (status === 'Success') {
            console.log(`REVENUE SECURED: Transaction ${transactionId} for Video ${videoId}`);
            
            // 3. THE REWARD: Grant Access
            // In a real database (MySQL/MongoDB), we mark this user/video combo as PAID.
            this.grantAccess(videoId, transactionId);

            // Tell CCBill we received the message so they stop "pinging" us
            res.status(200).send('Request Handled');
        }
    },

    grantAccess: function(videoId, txId) {
        // Logic to update your database:
        // db.query("INSERT INTO permissions (video_id, tx_id, expiry) VALUES (?, ?, ?)", [videoId, txId, '30d']);
        console.log(`Video ${videoId} is now UNLOCKED for the customer.`);
    }
};

module.exports = CCBillManager;
