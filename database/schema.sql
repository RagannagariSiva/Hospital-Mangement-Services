-- ============================================================
-- Hotel Platform - Database Schema
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS hotel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hotel_db;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    role        ENUM('ADMIN','STAFF','CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    active      TINYINT(1) NOT NULL DEFAULT 1,
    created_at  DATETIME(6),
    updated_at  DATETIME(6),
    INDEX idx_user_email  (email),
    INDEX idx_user_role   (role),
    INDEX idx_user_active (active)
);

-- Hotels
CREATE TABLE IF NOT EXISTS hotels (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    address     VARCHAR(500) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    country     VARCHAR(100) NOT NULL,
    phone       VARCHAR(20),
    email       VARCHAR(255),
    star_rating INT,
    image_url   VARCHAR(1000),
    active      TINYINT(1) NOT NULL DEFAULT 1,
    created_at  DATETIME(6),
    updated_at  DATETIME(6),
    INDEX idx_hotel_city    (city),
    INDEX idx_hotel_country (country),
    INDEX idx_hotel_active  (active)
);

-- Hotel Amenities
CREATE TABLE IF NOT EXISTS hotel_amenities (
    hotel_id BIGINT NOT NULL,
    amenity  VARCHAR(100),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    INDEX idx_hotel_amenities (hotel_id)
);

-- Rooms
CREATE TABLE IF NOT EXISTS rooms (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_id      BIGINT NOT NULL,
    room_number   VARCHAR(20) NOT NULL,
    room_type     ENUM('SINGLE','DOUBLE','TWIN','SUITE','DELUXE','PRESIDENTIAL') NOT NULL,
    capacity      INT,
    base_price    DECIMAL(10,2),
    current_price DECIMAL(10,2),
    floor_number  INT,
    image_url     VARCHAR(1000),
    description   TEXT,
    status        ENUM('AVAILABLE','OCCUPIED','MAINTENANCE','RESERVED') DEFAULT 'AVAILABLE',
    created_at    DATETIME(6),
    updated_at    DATETIME(6),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    INDEX idx_room_hotel  (hotel_id),
    INDEX idx_room_type   (room_type),
    INDEX idx_room_status (status)
);

-- Room Amenities
CREATE TABLE IF NOT EXISTS room_amenities (
    room_id BIGINT NOT NULL,
    amenity VARCHAR(100),
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_room_amenities (room_id)
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(20) NOT NULL UNIQUE,
    customer_id       BIGINT NOT NULL,
    room_id           BIGINT NOT NULL,
    check_in_date     DATE NOT NULL,
    check_out_date    DATE NOT NULL,
    number_of_guests  INT,
    total_amount      DECIMAL(10,2),
    paid_amount       DECIMAL(10,2) DEFAULT 0.00,
    status            ENUM('PENDING','CONFIRMED','CHECKED_IN','CHECKED_OUT','CANCELLED','NO_SHOW') DEFAULT 'PENDING',
    special_requests  TEXT,
    checked_in_at     DATETIME(6),
    checked_out_at    DATETIME(6),
    created_at        DATETIME(6),
    updated_at        DATETIME(6),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    INDEX idx_booking_customer  (customer_id),
    INDEX idx_booking_room      (room_id),
    INDEX idx_booking_ref       (booking_reference),
    INDEX idx_booking_status    (status),
    INDEX idx_booking_dates     (check_in_date, check_out_date)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id          BIGINT NOT NULL UNIQUE,
    amount              DECIMAL(10,2),
    status              ENUM('PENDING','COMPLETED','FAILED','REFUNDED') DEFAULT 'PENDING',
    payment_method      ENUM('CREDIT_CARD','DEBIT_CARD','UPI','NET_BANKING','CASH','RAZORPAY'),
    transaction_id      VARCHAR(100),
    razorpay_order_id   VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    paid_at             DATETIME(6),
    created_at          DATETIME(6),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    INDEX idx_payment_booking (booking_id),
    INDEX idx_payment_status  (status)
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    room_id    BIGINT NOT NULL,
    booking_id BIGINT,
    rating     INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment    TEXT,
    created_at DATETIME(6),
    FOREIGN KEY (user_id)    REFERENCES users(id),
    FOREIGN KEY (room_id)    REFERENCES rooms(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    INDEX idx_review_room    (room_id),
    INDEX idx_review_user    (user_id),
    UNIQUE KEY  uq_user_booking (user_id, booking_id)
);
