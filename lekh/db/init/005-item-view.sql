CREATE OR REPLACE VIEW item_view AS
SELECT
    item.id,
    item.name,
    item.serial,
    item.description,
    user.name AS created_by,
    user.email AS creator_email,
    CONCAT(asset.id, '.', asset.extension) AS image
FROM item
JOIN user ON item.user_id = user.id
JOIN asset ON item.asset_id = asset.id;

