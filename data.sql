use airline_cargo;

INSERT INTO Airlines (name, code) VALUES
('Air Global', 'AGL'),
('Sky Freight', 'SKF'),
('Cargo Express', 'CEX');

-- Inserting data into Handlers
INSERT INTO Handlers (name, company) VALUES
('John Logistics', 'Global Logistics Co.'),
('James Transport', 'Sky Handling Ltd.'),
('Michael Cargo', 'Express Freight Solutions');

-- Inserting data into CargoWarehouse
INSERT INTO CargoWarehouse (location, capacity, current_weight) VALUES
('JFK Airport Warehouse A', 50000.00, 12000.50),
('LAX Cargo Terminal B', 75000.00, 30500.75),
('ORD Freight Hub C', 60000.00, 15000.25);

-- Inserting data into Employees
INSERT INTO Employees (first_name, last_name, role, warehouse_id) VALUES
('Robert', 'Brown', 'Cargo Supervisor', 1),
('Emily', 'Davis', 'Operations Manager', 2),
('Michael', 'Wilson', 'Warehouse Clerk', 3);

-- Inserting data into Shipments
INSERT INTO Shipments (airline_id, handler_id, tracking_number, origin, destination, weight, quantity, status, shipment_date) VALUES
(1, 1, 'AGL123456', 'New York (JFK)', 'Los Angeles (LAX)', 1500.75, 50, 'In Transit', '2024-02-10'),
(2, 2, 'SKF987654', 'Chicago (ORD)', 'Miami (MIA)', 2400.50, 75, 'Pending', '2024-02-12'),
(3, 3, 'CEX654321', 'Los Angeles (LAX)', 'Houston (IAH)', 1800.30, 60, 'Delivered', '2024-02-08');

-- Inserting data into ShipmentHandlers (Many-to-Many relationship)
INSERT INTO ShipmentHandlers (shipment_id, handler_id) VALUES
(1, 1),
(2, 2),
(3, 3);