/**
 * THE VAULT - Stealth Paywall Bridge
 * Logic: Show "Lock" screen by default. Unlock only on verified payment.
 */

const VaultPlayer = {
    // 1. Initial State: Secure and Locked
    isPaid: false, 
    videoData: {
        id: "12345", // The XNXX Video ID from your database
        title: "Exclusive Vault Scene #42",
        price: "4.99"
    },

    init: function() {
        console.log("Vault Player Initialized... Monitoring Cash Flow.");
        this.renderLockScreen();
    },

    // 2. The "Tease" - High-quality UI to encourage payment
    renderLockScreen: function() {
        const playerContainer = document.getElementById('vault-container');
        
        playerContainer.innerHTML = `
            <div id="paywall-overlay" style="background: url('teaser-frame.gif'); background-size: cover;">
                <div class="glass-morphism">
                    <h2>${this.videoData.title}</h2>
                    <p>Unlock this premium 4K experience for only $${this.videoData.price}</p>
                    
                    <div class="payment-options">
                        <button onclick="VaultPlayer.triggerPayment('ccbill')" class="btn-primary">
                            Pay with Credit Card (Instant Access)
                        </button>
                        <button onclick="VaultPlayer.triggerPayment('crypto')" class="btn-crypto">
                            Pay with Bitcoin/Crypto (Discreet)
                        </button>
                    </div>
                    
                    <small>One-time payment. No subscription required.</small>
                </div>
            </div>
        `;
    },

    // 3. The Money Trigger
    triggerPayment: function(method) {
        console.log(`Redirecting to ${method} gateway...`);
        // In production, this redirects to your CCBill or NOWPayments link
        window.location.href = `/api/pay?method=${method}&videoId=${this.videoData.id}`;
    },

    // 4. The "Gold" - This is called after the Payment Webhook returns "Success"
    unlockVideo: function(secureToken) {
        const playerContainer = document.getElementById('vault-container');
        
        // Creative Twist: We don't just show the video. 
        // We inject a "Safe" iframe that hides the XNXX origin from casual 'Inspect Element' users.
        const embedUrl = `https://www.xnxx.com/embedframe/${this.videoData.id}`;
        
        playerContainer.innerHTML = `
            <div class="premium-wrapper">
                <div class="status-bar">VIP ACCESS ENABLED</div>
                <iframe 
                    src="${embedUrl}" 
                    frameborder="0" 
                    width="100%" 
                    height="500" 
                    scrolling="no" 
                    allowfullscreen="true">
                </iframe>
            </div>
        `;
        
        this.isPaid = true;
        console.log("Revenue Secured. User enjoying content.");
    }
};

// Start the engine
document.addEventListener('DOMContentLoaded', () => VaultPlayer.init());
