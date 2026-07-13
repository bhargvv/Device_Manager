CREATE DATABASE IF NOT EXISTS device_management;
USE device_management;

CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,

    machine_name VARCHAR(100) NOT NULL,
    finance_asset_id VARCHAR(50) NOT NULL UNIQUE,

    asset_state VARCHAR(50) NOT NULL,
    asset_condition VARCHAR(50) NOT NULL,

    site VARCHAR(100) NOT NULL,

    device_type VARCHAR(50) NOT NULL,

    manufacturer VARCHAR(100),
    model VARCHAR(100),

    serial_number VARCHAR(100) UNIQUE,

    assigned_user VARCHAR(100),

    finance_cap_date DATE,

    remarks TEXT,

    backup_check VARCHAR(20),

    trend VARCHAR(50),

    in_navin_list VARCHAR(50),

    os VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);