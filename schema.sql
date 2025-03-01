CREATE DATABASE airline_cargo;
USE airline_cargo;

-- Creating Airlines Table
CREATE TABLE Airlines (
    airline_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE
);

-- Creating Handlers Table
CREATE TABLE Handlers (
    handler_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255)
);

-- Creating Shipments Table
CREATE TABLE Shipments (
    shipment_id INT AUTO_INCREMENT PRIMARY KEY,
    airline_id INT,
    handler_id INT,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    origin VARCHAR(255),
    destination VARCHAR(255),
    weight DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    status ENUM('Pending', 'In Transit', 'Delivered', 'Delayed') DEFAULT 'Pending',
    shipment_date DATE,
    FOREIGN KEY (airline_id) REFERENCES Airlines(airline_id),
    FOREIGN KEY (handler_id) REFERENCES Handlers(handler_id)
);

-- Creating Cargo Warehouse Table
CREATE TABLE CargoWarehouse (
    warehouse_id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    capacity DECIMAL(10,2),
    current_weight DECIMAL(10,2)
);

-- Creating Employee Table
CREATE TABLE Employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    warehouse_id INT,
    FOREIGN KEY (warehouse_id) REFERENCES CargoWarehouse(warehouse_id)
);

-- Creating Shipments-Handlers Relationship Table
CREATE TABLE ShipmentHandlers (
    shipment_id INT,
    handler_id INT,
    PRIMARY KEY (shipment_id, handler_id),
    FOREIGN KEY (shipment_id) REFERENCES Shipments(shipment_id),
    FOREIGN KEY (handler_id) REFERENCES Handlers(handler_id)
);