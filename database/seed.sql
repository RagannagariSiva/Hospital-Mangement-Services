USE hotel_db;

-- ============================================================
-- Seed Data - Demo Users, Hotels, Rooms
-- Passwords are BCrypt hashed: 'admin123' and 'pass123'
-- ============================================================

INSERT INTO users (first_name, last_name, email, password, phone, role, active, created_at, updated_at) VALUES
('Admin',    'User',   'admin@hotel.com',    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIom', '+91-9999999999', 'ADMIN',    1, NOW(), NOW()),
('Staff',    'Member', 'staff@hotel.com',    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIom', '+91-8888888888', 'STAFF',    1, NOW(), NOW()),
('Rahul',    'Sharma', 'customer@hotel.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIom', '+91-7777777777', 'CUSTOMER', 1, NOW(), NOW()),
('Priya',    'Patel',  'priya@example.com',  '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIom', '+91-6666666666', 'CUSTOMER', 1, NOW(), NOW()),
('Arjun',    'Singh',  'arjun@example.com',  '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIom', '+91-5555555555', 'CUSTOMER', 1, NOW(), NOW());

-- Hotels
INSERT INTO hotels (name, description, address, city, country, phone, email, star_rating, image_url, active, created_at, updated_at) VALUES
('The Grand Mumbai', 'A luxurious 5-star hotel in the heart of Mumbai with panoramic sea views, world-class dining and premium amenities.', '123 Marine Drive', 'Mumbai', 'India', '+91-22-12345678', 'info@grandmumbai.com', 5, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', 1, NOW(), NOW()),
('Palace Delhi', 'Historic heritage hotel blending Mughal architecture with modern luxury in the capital city.', '45 Connaught Place', 'Delhi', 'India', '+91-11-87654321', 'reservations@palacedelhi.com', 5, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80', 1, NOW(), NOW()),
('Goa Beach Resort', 'Stunning beachfront resort with private beach access, water sports and tropical gardens.', 'Calangute Beach Road', 'Goa', 'India', '+91-832-2345678', 'hello@goabeach.com', 4, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', 1, NOW(), NOW()),
('Bangalore Suites', 'Contemporary business hotel in the IT hub, perfect for corporate travellers with co-working spaces.', '78 MG Road', 'Bangalore', 'India', '+91-80-3456789', 'stay@bangaloresuites.com', 4, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', 1, NOW(), NOW()),
('Udaipur Lake Palace', 'Floating palace on Lake Pichola offering unparalleled royal Rajasthani experience.', 'Pichola Lake', 'Udaipur', 'India', '+91-294-5678901', 'royal@udaipurpalace.com', 5, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80', 1, NOW(), NOW());

-- Hotel Amenities
INSERT INTO hotel_amenities (hotel_id, amenity) VALUES
(1,'Pool'),(1,'Spa'),(1,'WiFi'),(1,'Gym'),(1,'Restaurant'),(1,'Bar'),(1,'Valet'),
(2,'Pool'),(2,'Spa'),(2,'WiFi'),(2,'Gym'),(2,'Heritage Tour'),(2,'Restaurant'),
(3,'Private Beach'),(3,'Pool'),(3,'Water Sports'),(3,'WiFi'),(3,'Restaurant'),(3,'Beach Bar'),
(4,'Co-Working'),(4,'Pool'),(4,'WiFi'),(4,'Gym'),(4,'Restaurant'),(4,'Conference Room'),
(5,'Lake View'),(5,'Pool'),(5,'Spa'),(5,'WiFi'),(5,'Restaurant'),(5,'Cultural Shows');

-- Rooms for Hotel 1 (The Grand Mumbai)
INSERT INTO rooms (hotel_id, room_number, room_type, capacity, base_price, current_price, floor_number, image_url, description, status, created_at, updated_at) VALUES
(1, '101', 'SINGLE',        1,  4999.00,  4999.00, 1, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', 'Cozy single room with city view', 'AVAILABLE', NOW(), NOW()),
(1, '201', 'DOUBLE',        2,  7999.00,  7999.00, 2, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80', 'Spacious double room with sea view', 'AVAILABLE', NOW(), NOW()),
(1, '301', 'DELUXE',        2, 12999.00, 12999.00, 3, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', 'Deluxe room with private balcony', 'AVAILABLE', NOW(), NOW()),
(1, '401', 'SUITE',         4, 24999.00, 24999.00, 4, 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=600&q=80', 'Luxury suite with living area and jacuzzi', 'AVAILABLE', NOW(), NOW()),
(1, '501', 'PRESIDENTIAL',  6, 49999.00, 49999.00, 5, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80', 'Presidential suite with panoramic sea view', 'AVAILABLE', NOW(), NOW());

-- Rooms for Hotel 2 (Palace Delhi)
INSERT INTO rooms (hotel_id, room_number, room_type, capacity, base_price, current_price, floor_number, image_url, description, status, created_at, updated_at) VALUES
(2, '101', 'DOUBLE',  2,  8999.00,  8999.00, 1, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', 'Heritage double room with courtyard view', 'AVAILABLE', NOW(), NOW()),
(2, '201', 'DELUXE',  2, 13999.00, 13999.00, 2, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80', 'Deluxe heritage room', 'AVAILABLE', NOW(), NOW()),
(2, '301', 'SUITE',   4, 29999.00, 29999.00, 3, 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=600&q=80', 'Royal suite with private butler', 'AVAILABLE', NOW(), NOW());

-- Rooms for Hotel 3 (Goa Beach Resort)
INSERT INTO rooms (hotel_id, room_number, room_type, capacity, base_price, current_price, floor_number, image_url, description, status, created_at, updated_at) VALUES
(3, 'B01', 'DOUBLE',  2,  6999.00,  6999.00, 1, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', 'Beach view double room', 'AVAILABLE', NOW(), NOW()),
(3, 'B02', 'TWIN',    2,  6499.00,  6499.00, 1, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', 'Twin room with garden view', 'AVAILABLE', NOW(), NOW()),
(3, 'B03', 'SUITE',   4, 18999.00, 18999.00, 2, 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=600&q=80', 'Beachfront suite', 'AVAILABLE', NOW(), NOW());

-- Rooms for Hotel 4 (Bangalore Suites)
INSERT INTO rooms (hotel_id, room_number, room_type, capacity, base_price, current_price, floor_number, image_url, description, status, created_at, updated_at) VALUES
(4, '101', 'SINGLE',  1,  3999.00,  3999.00, 1, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', 'Business single room', 'AVAILABLE', NOW(), NOW()),
(4, '201', 'DOUBLE',  2,  6499.00,  6499.00, 2, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80', 'Business double room', 'AVAILABLE', NOW(), NOW()),
(4, '301', 'SUITE',   4, 14999.00, 14999.00, 3, 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=600&q=80', 'Executive suite', 'AVAILABLE', NOW(), NOW());

-- Rooms for Hotel 5 (Udaipur)
INSERT INTO rooms (hotel_id, room_number, room_type, capacity, base_price, current_price, floor_number, image_url, description, status, created_at, updated_at) VALUES
(5, 'R01', 'DELUXE',       2, 15999.00, 15999.00, 1, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', 'Lake view deluxe room', 'AVAILABLE', NOW(), NOW()),
(5, 'R02', 'SUITE',        4, 35999.00, 35999.00, 2, 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=600&q=80', 'Royal lake view suite', 'AVAILABLE', NOW(), NOW()),
(5, 'R03', 'PRESIDENTIAL', 6, 79999.00, 79999.00, 3, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80', 'Presidential floating palace suite', 'AVAILABLE', NOW(), NOW());

-- Room Amenities
INSERT INTO room_amenities (room_id, amenity)
SELECT r.id, a.amenity FROM rooms r
CROSS JOIN (
  SELECT 'WiFi' amenity UNION SELECT 'AC' UNION SELECT 'TV' UNION SELECT 'Mini Bar' UNION SELECT 'Safe'
) a WHERE r.room_type IN ('DELUXE','SUITE','PRESIDENTIAL');

INSERT INTO room_amenities (room_id, amenity)
SELECT r.id, a.amenity FROM rooms r
CROSS JOIN (SELECT 'WiFi' amenity UNION SELECT 'AC' UNION SELECT 'TV') a
WHERE r.room_type IN ('SINGLE','DOUBLE','TWIN');
