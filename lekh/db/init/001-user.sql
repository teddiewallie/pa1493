CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO user (email, password) VALUES ('admin@home.arpa', '$2b$12$aYttstoseRFWjNw2L4auM.bunFtiVDQmBcebLLEBF4/J5t69Yxqq2');

