-- replace dashes in country names with spaces
UPDATE
    countries
SET
    name = REPLACE(name, '_', ' ');

-- change UK to GB geo code
UPDATE
    countries
SET
    geo_code = 'GB'
WHERE
    geo_code = 'UK';

-- format "international conveyance Japan" correctly
UPDATE
    countries
SET
    name = 'International Conveyance (Cruise Ship) (Japan)'
WHERE
    name like '%conveyance%';