CREATE VIEW IF NOT EXISTS item_view AS
SELECT
    item.id,
    item.name,
    item.serial,
    item.description,
    item.shelf,
    user.name AS created_by,
    user.email AS creator_email,
    item.asset_id
FROM item
JOIN user ON item.user_id = user.id

