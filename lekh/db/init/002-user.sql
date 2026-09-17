CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL
);

INSERT INTO user (
    name,
    email,
    password,
    role_id
) VALUES (
    'Admin Adminsson',
    'admin@home.arpa',
    '$2b$12$aYttstoseRFWjNw2L4auM.bunFtiVDQmBcebLLEBF4/J5t69Yxqq2',
    1
);

