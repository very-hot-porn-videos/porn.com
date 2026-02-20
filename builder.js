const fs = require('fs');

// 1. Paste your XNXX video links here
const rawLinks = [
    "https://www.xnxx.com/video-12345/my_hot_upload_01",
    "https://www.xnxx.com/video-67890/exclusive_vip_scene",
    // Add thousands more here...
];

function buildCatalog(links) {
    const catalog = links.map((url, index) => {
        // Extract the ID from the XNXX URL
        const match = url.match(/video-(.*?)\//);
        const xnxxId = match ? match[1] : null;

        return {
            id: `v${index + 1}`,
            title: `Premium Vault Scene #${index + 1}`,
            price: 4.99, // Set your price here
            // We use XNXX's public thumbnail URL format
            thumbnail: `https://img-hw.xnxx-cdn.com/videos/thumbs169ll/${xnxxId}/default.jpg`,
            xnxx_id: xnxxId // This stays hidden from the user until they pay
        };
    });

    fs.writeFileSync('./src/database/catalog.json', JSON.stringify(catalog, null, 2));
    console.log(`Success! ${catalog.length} videos added to the Vault Catalog.`);
}

buildCatalog(rawLinks);
