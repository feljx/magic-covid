-- replace dashes in country names with spaces
UPDATE
    countries
SET
    name = REPLACE(name, '_', ' ');

-- format "international conveyance Japan" correctly
UPDATE
    countries
SET
    name = 'International Conveyance (Cruise Ship) (Japan)'
WHERE
    name like '%conveyance%';