CREATE TABLE IF NOT EXISTS article (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id INT NOT NULL,
    item_id INT NULL,
    group_id INT NULL,
    type_id INT NOT NULL,

    CONSTRAINT fk_user_id
        FOREIGN KEY (user_id)
        REFERENCES user (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_item_id
        FOREIGN KEY (item_id)
        REFERENCES item (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_group_id
        FOREIGN KEY (group_id)
        REFERENCES item_group (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_type_id
        FOREIGN KEY (type_id)
        REFERENCES article_type (id)
        ON DELETE RESTRICT
);

