CREATE TABLE IF NOT EXISTS item_group (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    known_issues TEXT NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO item_group (id, name, description, known_issues) VALUES
(
    1,
    'Ungrouped',
    'Items without a specific group',
    'This item has no specific group information. Check the individual item for known issues.'
);

