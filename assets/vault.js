const Vault = {
    catalog: [],
    init: async function() {
        console.log("Vault: Initializing Database Fetch...");
        try {
            const response = await fetch('database/catalog.json');
            let data = await response.json();

            // SAFETY NET: If data is not a list, turn it into one
            if (!Array.isArray(data)) {
                console.log("Vault: Single object detected, converting to Array...");
                data = [data];
            }

            this.catalog = data;
            this.renderGallery(this.catalog);
        } catch (err) {
            console.error("Vault Critical Error:", err);
            const grid = document.getElementById('vault-grid');
            if(grid) grid.innerHTML = `<div style="color:var(--gold);">DATABASE ERROR: ${err.message}</div>`;
        }
    },

    renderGallery: function(data) {
        const grid = document.getElementById('vault-grid');
        if (!grid) {
            console.error("Vault: Element #vault-grid not found!");
            return;
        }

        grid.innerHTML = data.map(v => `
            <div class="video-card" onclick="Vault.openModal('${v.id}')">
                <div class="thumb-wrap">
                    <img src="${v.thumbnail}">
                    <div class="lock-overlay">🔒</div>
                </div>
                <div class="video-meta">
                    <h3>${v.title}</h3>
                    <div class="price-badge">$${v.price} - UNLOCK</div>
                </div>
            </div>
        `).join('');
    },

    openModal: function(id) {
        const video = this.catalog.find(v => v.id === id);
        const modal = document.getElementById('buyModal');
        const title = document.getElementById('modalTitle');
        
        if (modal && title) {
            title.innerText = video.title;
            modal.style.display = 'flex';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Vault.init());
