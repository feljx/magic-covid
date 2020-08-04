-- change Britain's geo code from UK to GB
UPDATE
    continents
SET
    geo_code = 'AC'
WHERE
    name = 'America';

UPDATE
    continents
SET
    geo_code = 'AA'
WHERE
    name = 'Africa';

UPDATE
    continents
SET
    geo_code = 'AS'
WHERE
    name = 'Asia';

UPDATE
    continents
SET
    geo_code = 'EU'
WHERE
    name = 'Europe';

UPDATE
    continents
SET
    geo_code = 'OC'
WHERE
    name = 'Oceania';

UPDATE
    continents
SET
    geo_code = 'OT'
WHERE
    name = 'Other';

