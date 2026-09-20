CREATE TABLE IF NOT EXISTS item (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    serial VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    asset_id INT NOT NULL,
    CONSTRAINT fk_user_id
        FOREIGN KEY (user_id)
        REFERENCES user (id) ON DELETE CASCADE,
    CONSTRAINT fk_asset_id
        FOREIGN KEY (asset_id)
        REFERENCES asset (id) ON DELETE CASCADE
);

