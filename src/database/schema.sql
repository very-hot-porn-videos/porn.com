-- THE VAULT: MASTER REVENUE SCHEMA (MySQL/MariaDB)

-- 1. THE CONTENT VAULT
-- Stores the XNXX metadata and the 'Price of Admission'
CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    xnxx_id VARCHAR(50) NOT NULL,        -- The ID from the XNXX URL
    price DECIMAL(10, 2) DEFAULT 4.99,  -- Dynamic pricing for 'Money Flow'
    preview_gif_url VARCHAR(255),       -- The "Tease" image
    category ENUM('VIP', 'Amateur', 'High-End', 'Classic') DEFAULT 'VIP',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. THE CUSTOMER LEDGER
-- Tracks who has paid and for how long
CREATE TABLE access_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,   -- Collected during CCBill checkout
    video_id INT,
    transaction_id VARCHAR(100),         -- The 'Receipt' from CCBill
    payment_method VARCHAR(20),          -- 'CCBill' or 'Crypto'
    access_expires_at DATETIME,          -- To support 'Limited Time' rentals
    FOREIGN KEY (video_id) REFERENCES videos(id)
);

-- 3. THE REVENUE ANALYTICS (The "Money Flow" Dashboard)
-- Tracks every click and purchase attempt to optimize conversion
CREATE TABLE revenue_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id INT,
    event_type ENUM('view', 'click_buy', 'payment_success', 'payment_fail'),
    source_site VARCHAR(100),            -- e.g., 'Twitter', 'Direct', 'Referral'
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos(id)
);
