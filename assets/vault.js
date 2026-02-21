/**
 * THE VAULT ENGINE v3.1 - 2026 
 * Optimized for GitHub Pages Root Structure
 */

const Vault = {
    catalog: [],
    selectedVideoId: null,

    init: async function() {
        console.log("Vault: Initializing Database Fetch...");
        const grid = document.getElementById('vault-grid');

        try {
            // Path Check: database/catalog.json (No leading slash for GitHub Pages)
            const response = await fetch('database/catalog.json');
            
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - Database file not found.`);
            }

            this.catalog = await response.json();
            console.log("Vault: Database Loaded Successfully", this.catalog);
            
            this.renderGallery(this.catalog);
            this.setupCategoryFilters();

        } catch (err) {
            console.error("Vault Critical Error:", err);
            grid.innerHTML = `
                <div style="padding: 100px; text-align: center; color: #D4AF37; grid-column: 1/-1;">
                    <p>⚠️ VAULT OFFLINE</p>
                    <p style="font-size: 0.8rem; color: #555;">Reason: ${err.message}</p>
                    <small style="color: #333;">Check: database/catalog.json exists in root.</small>
                </div>`;
        }
    },

    renderGallery: function(data) {
        const grid = document.getElementById('vault-grid');
        
        if (!data || data.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #444;">Vault is currently empty.</p>`;
            return;
        }

        grid.innerHTML = data.map(v => `
            <div class="video-card" onclick="Vault.openModal('${v.id}')">
                <div class="thumb-wrap">
                    <img src="${v.thumbnail}" loading="lazy" onerror="this.src='https://placehold.co/600x400/111/D4AF37?text=Preview+Locked'">
                    <div class="lock-overlay"><span class="lock-icon">🔒</span></div>
                </div>
                <div class="video-meta">
                    <span style="font-size: 10px; color: #D4AF37; letter-spacing: 1px;">${v.category || 'VIP'}</span>
                    <h3>${v.title}</h3>
                    <div class="price-badge">$${v.price.toFixed(2)} - UNLOCK</div>
                </div>
            </div>
        `).join('');
    },

    openModal: function(id) {
        this.selectedVideoId = id;
        const video = this.catalog.find(v => v.id === id);
        if(video) {
            document.getElementById('modalTitle').innerText = video.title;
            document.getElementById('buyModal').style.display = 'flex';
        }
    },

    initiatePayment: function(method) {
        const btn = event.target;
        btn.innerText = "REDIRECTING...";
        
        // Simulation for testing: Generates a random Transaction ID
        const fakeTid = 'TX' + Math.floor(Math.random() * 999999);
        
        setTimeout(() => {
            window.location.href = `play.html?vid=${this.selectedVideoId}&tid=${fakeTid}`;
        }, 1000);
    },

    setupCategoryFilters: function() {
        const tags = document.querySelectorAll('.cat-tag');
        tags.forEach(tag => {
            tag.addEventListener('click', () => {
                tags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                
                const category = tag.innerText.trim();
                if (category === "ALL SCENES") {
                    this.renderGallery(this.catalog);
                } else {
                    const filtered = this.catalog.filter(v => v.category === category);
                    this.renderGallery(filtered);
                }
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => Vault.init());
