import json
from datetime import datetime
from operator import attrgetter
from itertools import groupby


ORIGINAL = "covid19_original.json"
PROJECT = "covid19_project.json"
OUTPUT = "covid19_repaired.json"
LOG = "log.json"
LATEST_DATE = datetime(2020,6,14)
"""
PROBLEMS WITH PROJECT FILE:

(1) Incomplete: Dataset cut-off after Italy and whole countries missing-> Syntax error
(2) Missing data:
  (2.1) CountryTerritoryCode
  (2.2) Population Data (popData2018)
(3) Obsolete data:
  (3.1) Population Data is from 2018
  (3.2) Latest records from 16/05/2020
(4) Unsuited data type (string) for cases, deaths and population.
(5) Cumulative data for 14 days missing.

SOLUTIONS:

(1) Fix syntax error manually, get missing data from original.
    (Remove Italy completely to know exactly where to start in original)
(2) Check datapoints for errors -> Repair from original
(3.1) Replace with newer data
(3.2) Add missing data.
(4) Convert data to integer.
(5) Delete that attribute and calculate it by ourselves later on.
"""

def main():
  original = json.load(open(ORIGINAL))
  broken = json.load(open(PROJECT))

  records_o = original["records"]
  records_b = broken["records"]

  geo_ids_o = {r["geoId"] for r in records_o}
  geo_ids_b = {r["geoId"] for r in records_b}

  # Get pop data and correct geoIds from original dataset
  popData2019 = {}
  territory_codes = {}
  for r in records_o:

    geo_id = r["geoId"]
    country_name = r["countriesAndTerritories"]

    if not country_name in territory_codes:
      territory_codes[country_name] = r["countryterritoryCode"]

    if not geo_id in popData2019:
      popData2019[geo_id] = r["popData2019"]

  for r in records_b:
    # Convert cases and deaths to integer.
    to_int(r, ["cases", "deaths"])

    # Replace old with new popData
    geo_id = r["geoId"]
    del r["popData2018"]
    r["popData2019"] = popData2019[geo_id]

    # Fix empty geoIds
    if r["countryterritoryCode"] == "":
      print("Empty countryTerritoryCode at:" + r["countriesAndTerritories"])
      r["countryterritoryCode"] = territory_codes[r["countriesAndTerritories"]]


  # If date after 16/05/2020 OR Country >= Italy -> Add to project dataset.

  for r in records_o:
    date = convert_date(r["dateRep"])
    geo_id = r["geoId"]
    if (date > LATEST_DATE) or (geo_id >= "IT") or (geo_id not in geo_ids_b): # String comparison is lexicographic.
      records_b.append(r)

  # Sort by country
  records_b.sort(
    key = (lambda x: x["countriesAndTerritories"])
  )

  # Group by country, then sort by date.
  grouped_by_country = groupby(
    records_b, 
    key = (lambda x: x["geoId"])
  )

  final = []
  for group in grouped_by_country:
    final.extend(
      sorted(
        list(group[1]),
        key = (lambda x: x["dateRep"]),
        reverse = True
      )
    )

  records_b = final

  print(f"Length of original: {len(records_o)} | Length of repaired: {len(records_b)}")

  # Log count of entries

  count = {}

  for r in records_b:
    geo_id = r["geoId"]
    if geo_id in count:
      count[geo_id][0] += 1
    else:
      count[geo_id] = [1,0]
  
  for r in records_o:
    geo_id = r["geoId"]
    if geo_id in count:
      count[geo_id][1] += 1
    else:
      count[geo_id] = [0,1]
  
  # Check for anomalies

  for geo_id in count:
    if count[geo_id][0] != count[geo_id][1]:
      print(f"Anomaly at: {geo_id} - Repaired file > {count[geo_id]} < Original File")

  # Write log to file

  with open(LOG, "w") as log_file:
    json.dump(count, log_file, indent = 2)

  # Write final dataset to output file.

  with open(OUTPUT, "w") as output_file:
    json.dump(broken, output_file, indent = 2)

  

def convert_date(str):
  return datetime.strptime(str, "%d/%m/%Y")

def to_int(datapoint, attributes):
  for a in attributes:
    datapoint[a] = int(datapoint[a])



if __name__ == "__main__":
  main()