DROP TABLE IF EXISTS continents;
CREATE TABLE continents (
	name text,
	geo_code varchar(2) DEFAULT NULL,
	pop bigint DEFAULT NULL,
	PRIMARY KEY(name)
);
INSERT INTO continents VALUES ('Asia', NULL, NULL);
INSERT INTO continents VALUES ('Europe', NULL, NULL);
INSERT INTO continents VALUES ('Africa', NULL, NULL);
INSERT INTO continents VALUES ('America', NULL, NULL);
INSERT INTO continents VALUES ('Oceania', NULL, NULL);
INSERT INTO continents VALUES ('Other', NULL, NULL);