CREATE TABLE IF NOT EXISTS item (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    serial VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    shelf VARCHAR(255),
    known_issues TEXT NOT NULL,
    borrowable BOOLEAN NOT NULL DEFAULT FALSE,
    bookable BOOLEAN NOT NULL DEFAULT FALSE,
    user_id INT NOT NULL,
    asset_id INT NOT NULL,
    status_id INT NOT NULL DEFAULT 1,
    group_id INT NOT NULL DEFAULT 1,

    CONSTRAINT fk_user_id
        FOREIGN KEY (user_id)
        REFERENCES user (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_asset_id
        FOREIGN KEY (asset_id)
        REFERENCES asset (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_status_id
        FOREIGN KEY (status_id)
        REFERENCES item_status (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_group_id
        FOREIGN KEY (group_id)
        REFERENCES item_group (id)
        ON DELETE RESTRICT
);

CREATE VIEW IF NOT EXISTS item_view AS
SELECT
    item.id,
    item.name,
    item.serial,
    item.description,
    item.known_issues,
    item.shelf,
    item.group_id,
    item.borrowable,
    item.bookable,
    user.name AS created_by,
    user.email AS creator_email,
    item.asset_id,
    item_status.id AS status_id,
    item_status.name AS status_name
FROM item
JOIN user ON item.user_id = user.id
JOIN item_status ON item.status_id = item_status.id
;

