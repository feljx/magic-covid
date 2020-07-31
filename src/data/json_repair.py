from itertools import groupby
from operator import attrgetter
from datetime import datetime
import json
import os

SCRIPT_DIR_PATH = os.path.dirname(os.path.realpath(__file__))
JSON_DIR = f"{SCRIPT_DIR_PATH}/raw"
CORRECT_DATASET = f"{JSON_DIR}/covid19.json"
BROKEN_DATASET = f"{JSON_DIR}/_old_covid19.json"
OUTPUT = f"{JSON_DIR}/covid19_repaired.json"
LOG = "log.json"
LATEST_DATE = datetime(2020, 6, 14)
EARLIEST_DATE = datetime(2019, 12, 31)

"""
PROBLEMS WITH BROKEN_DATASET FILE:

(1) Incomplete: Dataset cut-off after Italy and whole countries missing-> Syntax error
(2) Missing data:
  (2.1) CountryTerritoryCode
  (2.2) Population Data (popData2018)
(3) Obsolete data:
  (3.1) Population Data is from 2018
  (3.2) Latest records from 16/06/2020
(4) Unsuited data type (string) for cases, deaths and population.
(5) Cumulative data for 14 days missing.

SOLUTIONS:

(1) Fix syntax error manually, get missing data from original.
    (Remove Italy completely to know exactly where to start in original)
(2) Check datapoints for errors -> Repair from original
(3.1) Delete Attribute
(3.2) Add missing data.
(4) Convert data to integer.
(5) Delete that attribute and calculate it by ourselves later on.
"""


def convert_date(str):
    return datetime.strptime(str, "%d/%m/%Y")


def to_int(datapoint, attributes):
    for a in attributes:
        datapoint[a] = int(datapoint[a])


def main():
    original = json.load(open(CORRECT_DATASET))
    broken = json.load(open(BROKEN_DATASET))

    records_o = original["records"]
    records_b = broken["records"]

    geo_ids_o = {r["geoId"] for r in records_o}
    geo_ids_b = {r["geoId"] for r in records_b}

    # Get pop data and correct geoIds from original dataset
    popData2019 = {}
    # territory_codes = {}
    for r in records_o:

        geo_id = r["geoId"]

        if not geo_id in popData2019:
            popData2019[geo_id] = r["popData2019"]

    all_records_b_dates = {}
    for r in records_b:
        # add row date
        geo_id = r["geoId"]
        date = r["dateRep"]
        if geo_id in all_records_b_dates:
            all_records_b_dates[geo_id].append(date)
        else:
            all_records_b_dates[geo_id] = [date]

        # Convert cases and deaths to integer.
        to_int(r, ["cases", "deaths"])

        # Replace old with new popData
        geo_id = r["geoId"]
        del r["popData2018"]
        r["popData2019"] = popData2019[geo_id]

        # delete 3-character code, comment out rest of logic
        del r["countryterritoryCode"]

    # If date after 16/05/2020 OR Country >= Italy -> Add to project dataset.

    for r in records_o:
        date = r["dateRep"]
        geo_id = r["geoId"]
        # String comparison is lexicographic.

        has_additional_data = False
        try:
            has_additional_data = not (date in all_records_b_dates[geo_id])
        except KeyError:
            pass

        broken_data_missing_geo_id = geo_id not in geo_ids_b
        data_incomplete = has_additional_data or broken_data_missing_geo_id

        if data_incomplete:
            records_b.append(r)

    # Sort by country
    records_b.sort(
        key=(lambda x: x["countriesAndTerritories"])
    )

    # Group by country, then sort by date.
    grouped_by_country = groupby(
        records_b,
        key=(lambda x: x["geoId"])
    )

    final = []
    for group in grouped_by_country:
        final.extend(
            sorted(
                list(group[1]),
                key=(lambda x: x["dateRep"]),
                reverse=True
            )
        )

    records_b = final

    print(
        f"Length of original: {len(records_o)} | Length of repaired: {len(records_b)}")

    # Log count of entries

    count_broken = {geo_id: (sum(1 if d["geoId"] == geo_id else 0
                                 for d in records_b)) for geo_id in geo_ids_b}

    count_original = {geo_id: (
        sum(1 if d["geoId"] == geo_id else 0 for d in records_o)) for geo_id in geo_ids_o}

    longer_count = max(count_broken.items(), count_original.items())
    for geo_id, count in longer_count:
        not count
        try:
            count_o = count_original[geo_id]
            count_b = count_broken[geo_id]

            if count_o != count_b:
                print(
                    f"differing count for geoID {geo_id} -> original: {count_o}  broken: {count_b}")
        except KeyError:
            pass

        # for r in records_b:
        #     geo_id=r["geoId"]
        #     if geo_id in count:
        #         count[geo_id][0] += 1
        #     else:
        #         count[geo_id]=[1, 0]

        # for r in records_o:
        #     geo_id=r["geoId"]
        #     if geo_id in count:
        #         count[geo_id][1] += 1
        #     else:
        #         count[geo_id]=[0, 1]

        # # Check for anomalies

        # for geo_id in count:
        #     if count[geo_id][0] != count[geo_id][1]:
        #         print(
        #             f"Anomaly at: {geo_id} - Repaired file > {count[geo_id]} < Original File")

        # Write log to file

        # with open(LOG, "w") as log_file:
        #     json.dump(count, log_file, indent=2)

        # Write final dataset to output file.

    with open(OUTPUT, "w") as output_file:
        json.dump(broken, output_file, indent=2)


if __name__ == "__main__":
    main()
