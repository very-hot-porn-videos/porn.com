/**
 * THE VAULT ENGINE v2.0 - 2026 EDITION
 * Purpose: Handle 1000s of XNXX catalog items and manage the "Money Flow."
 */

const Vault = {
    catalog: [],
    selectedVideoId: null,

    // 1. Initialize the Engine
    init: async function() {
        console.log("Vault Engine Starting...");
        try {
            // Fetch the secret catalog JSON you created with your local builder
            const response = await fetch('src/database/catalog.json');
            if (!response.ok) throw new Error("Catalog not found");
            
            this.catalog = await response.json();
            this.renderGallery(this.catalog);
        } catch (err) {
            console.error("Critical Vault Error:", err);
            document.getElementById('vault-grid').innerHTML = 
                `<p style="color:red">Connection to Secure Database Failed. Refreshing...</p>`;
        }
    },

    // 2. High-Performance Gallery Renderer
    renderGallery: function(items) {
        const grid = document.getElementById('vault-grid');
        
        // Use document fragment for faster rendering of 1000s of items
        const html = items.map(video => `
            <div class="video-card" onclick="Vault.openPurchaseModal('${video.id}')">
                <div class="thumb-wrap">
                    <img src="${video.thumbnail}" loading="lazy" alt="VIP Access">
                    <div class="lock-overlay">
                        <span class="lock-icon">🔒</span>
                    </div>
                </div>
                <div class="video-meta">
                    <h3>${video.title}</h3>
                    <div class="price-badge">$${video.price.toFixed(2)} - UNLOCK NOW</div>
                </div>
            </div>
        `).join('');
        
        grid.innerHTML = html;
    },

    // 3. Open the "Money Flow" Gate
    openPurchaseModal: function(id) {
        const video = this.catalog.find(v => v.id === id);
        if (!video) return;

        this.selectedVideoId = id;
        document.getElementById('modalTitle').innerText = video.title;
        document.getElementById('buyModal').style.display = 'flex';
        
        // Subtle haptic feedback feel
        console.log(`User intent captured: Buying ${id}`);
    },

    // 4. Trigger the Payment Gateway (CCBill / Crypto)
    initiatePayment: function(method) {
        const video = this.catalog.find(v => v.id === this.selectedVideoId);
        
        // Creative "Loading" State
        const btn = event.target;
        btn.innerText = "Securing Connection...";
        btn.disabled = true;

        // CONSTRUCTION OF THE PAYMENT LINK
        // Replace 'YOUR_CCBILL_URL' with your real checkout link
        const baseGateway = method === 'cc' 
            ? 'https://bill.ccbill.com/jpost/signup.cgi?clientAccNo=XXXXXX&clientSubAccNo=XXXX' 
            : '/api/crypto-pay';

        // Attach the Video ID so the redirect knows what to play
        const finalUrl = `${baseGateway}&vid=${video.id}&price=${video.price}`;

        // Redirect to the Money Flow
        setTimeout(() => {
            window.location.href = finalUrl;
        }, 800);
    }
};

// Start the Vault immediately
document.addEventListener('DOMContentLoaded', () => Vault.init());
