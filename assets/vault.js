const Vault = {
    catalog: [],
    init: async function() {
        console.log("Vault: Fetching Secure Database...");
        try {
            // Relative path for GitHub Pages
            const response = await fetch('database/catalog.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            let data = await response.json();

            // Safety: Force data into an Array if it's a single object
            this.catalog = Array.isArray(data) ? data : [data];
            
            console.log("Vault: Connection Successful.");
            this.renderGallery(this.catalog);
        } catch (err) {
            console.error("Vault Connection Failed:", err);
            const grid = document.getElementById('vault-grid');
            if (grid) {
                grid.innerHTML = `<div style="padding:100px; color:#D4AF37; text-align:center;">
                    ⚠️ DATABASE CONNECTION ERROR<br>
                    <small style="color:#444;">Ensure database/catalog.json is valid</small>
                </div>`;
            }
        }
    },

    renderGallery: function(data) {
        const grid = document.getElementById('vault-grid');
        if (!grid) return;

        grid.innerHTML = data.map(v => `
            <div class="video-card" onclick="Vault.openModal('${v.id}')">
                <div class="thumb-wrap">
                    <img src="${v.thumbnail}" loading="lazy">
                    <div class="lock-overlay"><span class="lock-icon">🔒</span></div>
                </div>
                <div class="video-meta">
                    <h3>${v.title}</h3>
                    <div class="price-badge">$${v.price.toFixed(2)} - UNLOCK</div>
                </div>
            </div>
        `).join('');
    },

    openModal: function(id) {
        const video = this.catalog.find(v => v.id === id);
        const modal = document.getElementById('buyModal');
        const title = document.getElementById('modalTitle');
        if (modal && title && video) {
            title.innerText = video.title;
            modal.style.display = 'flex';
        }
    },

    initiatePayment: function(method) {
        // Redirect to play.html with a temporary success token for testing
        const tid = "TEST_" + Math.random().toString(36).substr(2, 9);
        window.location.href = `play.html?vid=${this.catalog[0].id}&tid=${tid}`;
    }
};

document.addEventListener('DOMContentLoaded', () => Vault.init());
