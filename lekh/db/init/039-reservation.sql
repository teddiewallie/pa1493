CREATE TABLE IF NOT EXISTS reservation (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    is_pending BOOLEAN NOT NULL DEFAULT TRUE,
    returned_at DATETIME DEFAULT NULL,
    item_id INT NOT NULL,
    user_id INT NOT NULL,

    CONSTRAINT fk_reservation_item_id
        FOREIGN KEY (item_id)
        REFERENCES item (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_reservation_user_id
        FOREIGN KEY (user_id)
        REFERENCES user (id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_reservation_dates
        CHECK (end_at > start_at)
);

