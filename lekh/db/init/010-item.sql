CREATE TABLE IF NOT EXISTS item (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    serial VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    shelf VARCHAR(255),
    user_id INT NOT NULL,
    asset_id INT NOT NULL,
    status_id INT NOT NULL DEFAULT 1,
    group_id INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_user_id
        FOREIGN KEY (user_id)
        REFERENCES user (id) ON DELETE CASCADE,
    CONSTRAINT fk_asset_id
        FOREIGN KEY (asset_id)
        REFERENCES asset (id) ON DELETE CASCADE,
    CONSTRAINT fk_status_id
        FOREIGN KEY (status_id)
        REFERENCES item_status (id) ON DELETE CASCADE,
    CONSTRAINT fk_group_id
        FOREIGN KEY (group_id)
        REFERENCES item_group (id) ON DELETE CASCADE
);

