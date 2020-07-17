DROP TABLE IF EXISTS continents;
CREATE TABLE continents (name text, pop bigint DEFAULT NULL, PRIMARY KEY(name));
INSERT INTO continents VALUES ('Asia', NULL);
INSERT INTO continents VALUES ('Europe', NULL);
INSERT INTO continents VALUES ('Africa', NULL);
INSERT INTO continents VALUES ('America', NULL);
INSERT INTO continents VALUES ('Oceania', NULL);
INSERT INTO continents VALUES ('Other', NULL);