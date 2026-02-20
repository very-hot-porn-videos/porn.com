/**
 * THE VAULT ENGINE v1.0
 * Pure JavaScript - Optimized for GitHub Pages & XNXX Integration
 */

const Vault = {
    catalog: [],
    
    // 1. Initialize and Load Thousands of Videos
    init: async function() {
        try {
            const response = await fetch('../src/database/catalog.json');
            this.catalog = await response.json();
            this.renderGallery(this.catalog);
            console.log("Vault loaded: " + this.catalog.length + " videos ready.");
        } catch (err) {
            console.error("Vault Error: Database not found.");
        }
    },

    // 2. Build the Premium Netflix-style Grid
    renderGallery: function(data) {
        const grid = document.getElementById('vault-grid');
        grid.innerHTML = data.map(video => `
            <div class="video-card" onclick="Vault.showPreview('${video.id}')">
                <div class="thumb-container">
                    <img src="${video.thumbnail}" class="blurred-image" alt="Premium Content">
                    <div class="overlay-lock">
                        <span class="lock-icon">🔒</span>
                        <span class="unlock-text">UNLOCK FOR $${video.price}</span>
                    </div>
                </div>
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <span class="badge">4K ULTRA HD</span>
                </div>
            </div>
        `).join('');
    },

    // 3. The "Tease" Modal - Shows before they pay
    showPreview: function(id) {
        const video = this.catalog.find(v => v.id === id);
        
        // This is a creative 'teaser' popup
        const modal = document.createElement('div');
        modal.className = 'vault-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <img src="${video.thumbnail}" style="width:100%; border-radius:10px;">
                <h2>Unlock Full Access</h2>
                <p>You are about to purchase: <strong>${video.title}</strong></p>
                <div class="payment-buttons">
                    <button class="pay-cc" onclick="Vault.pay('${video.id}', 'cc')">Pay with Credit Card</button>
                    <button class="pay-crypto" onclick="Vault.pay('${video.id}', 'crypto')">Pay with Crypto</button>
                </div>
                <p class="discreet-hint">Safe & Discreet Billing Guaranteed.</p>
            </div>
        `;
        document.body.appendChild(modal);
    },

    // 4. Send them to the Money Flow
    pay: function(id, method) {
        // Redirect logic to your CCBill / Crypto Gateway
        window.location.href = `https://your-payment-gateway.com/pay?vid=${id}&method=${method}`;
    }
};

// Start the Vault when page loads
document.addEventListener('DOMContentLoaded', () => Vault.init());
