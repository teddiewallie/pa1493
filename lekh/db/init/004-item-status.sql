CREATE TABLE IF NOT EXISTS item_status (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO item_status (id, name) VALUES
(1, 'Available'),
(2, 'On Loan'),
(3, 'In Repair'),
(4, 'Out of Service'),
(5, 'Retired');

