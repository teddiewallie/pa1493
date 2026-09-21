CREATE VIEW IF NOT EXIST item_view AS
SELECT
    item.id,
    item.name,
    item.serial,
    item.description,
    user.name AS created_by,
    user.email AS creator_email,
    item.asset_id
FROM item
JOIN user ON item.user_id = user.id

