-- replace dashes in country names with spaces
UPDATE
    countries
SET
    name = REPLACE(name, '_', ' ');

-- change Britain's geo code from UK to GB
UPDATE
    countries
SET
    geo_code = 'GB'
WHERE
    geo_code = 'UK';

-- change Greece's geo code from EL to GR
UPDATE
    countries
SET
    geo_code = 'GR'
WHERE
    geo_code = 'EL';

-- format "international conveyance Japan" correctly
UPDATE
    countries
SET
    name = 'International Conveyance (Cruise Ship) (Japan)'
WHERE
    name like '%conveyance%';