CREATE TABLE IF NOT EXISTS role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(12) NOT NULL
);

INSERT INTO role (id, name) VALUES
(1, 'maintainer'),
(2, 'student');

