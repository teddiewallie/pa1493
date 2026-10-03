CREATE TABLE IF NOT EXISTS item_group (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

INSERT INTO item_group (id, name, description)
VALUES (1, 'Ungrouped', 'Items without a specific group');

