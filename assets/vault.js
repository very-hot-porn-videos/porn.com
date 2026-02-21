/**
 * THE VAULT ENGINE v3.0 - 2026 HIGH-VELOCITY EDITION
 * Optimized for Root Directory Structure & XNXX Integration
 */

const Vault = {
    catalog: [],
    filteredCatalog: [],
    selectedVideoId: null,

    // 1. Boot the Engine
    init: async function() {
        console.log("Vault: Establishing Secure Handshake...");
        try {
            // Updated Path: Directly looks into the database folder from root
            const response = await fetch('database/catalog.json');
            if (!response.ok) throw new Error("Database offline or path incorrect");
            
            this.catalog = await response.json();
            this.filteredCatalog = this.catalog; // Initial state
            
            this.renderGallery(this.filteredCatalog);
            this.setupListeners();
        } catch (err) {
            console.error("Vault Critical Error:", err);
            document.getElementById('vault-grid').innerHTML = `
                <div style="color:var(--gold); padding:100px; text-align:center;">
                    <p>OFFLINE: SECURE DATABASE NOT FOUND</p>
                    <small style="color:#333;">Check: /database/catalog.json location</small>
                </div>`;
        }
    },

    // 2. High-Performance Grid Rendering
    renderGallery: function(data) {
        const grid = document.getElementById('vault-grid');
        
        if (data.length === 0) {
            grid.innerHTML = `<p style="color:#444; grid-column:1/-1; text-align:center;">No scenes match your criteria.</p>`;
            return;
        }

        grid.innerHTML = data.map(v => `
            <div class="video-card" onclick="Vault.openModal('${v.id}')">
                <div class="thumb-wrap">
                    <img src="${v.thumbnail}" loading="lazy" alt="VIP Preview">
                    <div class="lock-overlay">
                        <span class="lock-icon">🔒</span>
                    </div>
                </div>
                <div class="video-meta">
                    <span class="category-tag">${v.category || 'PREMIUM'}</span>
                    <h3>${v.title}</h3>
                    <div class="price-badge">$${v.price.toFixed(2)} - UNLOCK</div>
                </div>
            </div>
        `).join('');
    },

    // 3. The "Money Flow" Gate
    openModal: function(id) {
        this.selectedVideoId = id;
        const video = this.catalog.find(v => v.id === id);
        
        if (!video) return;

        const modal = document.getElementById('buyModal');
        document.getElementById('modalTitle').innerText = video.title;
        modal.style.display = 'flex';
    },

    // 4. Payment Gateway Logic
    initiatePayment: function(method) {
        const video = this.catalog.find(v => v.id === this.selectedVideoId);
        
        // This is where you put your real CCBill or Crypto Link
        // We use SUCCESS_TOKEN for testing. Replace with your actual gateway URL.
        const gatewayURL = `play.html?vid=${video.id}&tid=TX_${Math.random().toString(36).substr(2, 9)}`;
        
        const btn = event.target;
        btn.innerText = "REDIRECTING TO SECURE PAY...";
        btn.style.opacity = "0.5";

        setTimeout(() => {
            window.location.href = gatewayURL;
        }, 800);
    },

    // 5. Filtering Logic (For the Category Bar)
    setupListeners: function() {
        const tags = document.querySelectorAll('.cat-tag');
        tags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                // UI Toggle
                tags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');

                // Filter Logic
                const filter = tag.innerText.toUpperCase();
                if (filter === 'ALL SCENES') {
                    this.renderGallery(this.catalog);
                } else {
                    const filtered = this.catalog.filter(v => v.category.toUpperCase() === filter);
                    this.renderGallery(filtered);
                }
            });
        });
    }
};

// Start the Engine
document.addEventListener('DOMContentLoaded', () => Vault.init());
