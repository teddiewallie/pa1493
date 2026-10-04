CREATE TABLE IF NOT EXISTS article_type (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO article_type (id, name) VALUES
(1, 'Guide'),
(2, 'Equipment'),
(3, 'Projects'),
(4, 'Documentation')

