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


-- fix Côte d'Ivoire's name
UPDATE
    countries
SET
    name = "Côte d'Ivoire"
WHERE
    geo_code = 'CI';

