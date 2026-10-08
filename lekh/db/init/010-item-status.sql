CREATE TABLE IF NOT EXISTS item_status (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO item_status (id, name) VALUES
(1, 'Available'),
(2, 'In Repair'),
(3, 'Out of Service'),
(4, 'Retired');

