CREATE VIEW IF NOT EXISTS item_view AS
SELECT
    item.id,
    item.name,
    item.serial,
    item.description,
    item.shelf,
    item.group_id,
    user.name AS created_by,
    user.email AS creator_email,
    item.asset_id,
    item_status.id AS status_id,
    item_status.name AS status_name
FROM item
JOIN user ON item.user_id = user.id
JOIN item_status ON item.status_id = item_status.id
;

