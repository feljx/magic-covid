from pony.orm import *
from datetime import date, datetime
import json

db = Database()

class Country(db.Entity):
    name = Required(str)
    geo_id = PrimaryKey(str)
    country_code = Optional(str)
    population = Optional(int)
    continent = Optional(str)
    case_data = Set("CaseData")

class CaseData(db.Entity):
    geo_id = Required(Country)
    date = Required(date)
    PrimaryKey(geo_id, date)
    cases = Required(int)
    cumulative = Optional(float)
    deaths = Required(int)

db.bind(
    provider="postgres",
    user="covid",
    password="covid",
    host="localhost",
    database="covid"
)

db.generate_mapping(create_tables=True)

@db_session
def populate_db(filename):

    with open(filename) as f:
        data = json.load(f) 

    length = len(data["records"])

    print(
        "First Entry:\n", 
        json.dumps(data["records"][0], indent=4),
        "Number of objects: ",
        len(data["records"]))

    current_country = None
    errors = 0

    for e in data["records"]:
        new_country = e["countryterritoryCode"]
        
        if new_country != current_country or current_country == None:
            current_country = new_country

            geo_id = e["geoId"]

            if geo_id == "UK":
                geo_id = "GB"
            elif geo_id == "EL":
                geo_id = "GR"

            try:
                country = Country(
                    name = e["countriesAndTerritories"],
                    geo_id = geo_id,
                    country_code = e["countryterritoryCode"],
                    population = e["popData2019"],
                    continent = e["continentExp"]
                )
            except:
                errors += 1
                print(f"{e} Error at country entity creation:\n {e}")
                continue

        date_c = datetime.strptime(e["dateRep"], "%d/%m/%Y")
        cumulative = e["Cumulative_number_for_14_days_of_COVID-19_cases_per_100000"]
        
        if cumulative == "":
            cumulative = 0 
        
        try:
            case_data = CaseData(
                geo_id = country,
                date = date_c,
                cases = e["cases"],
                cumulative = cumulative,
                deaths = e["deaths"]
            )
        except:
            errors += 1
            print(f"{e} Error at case_data entity creation:\n {e}")
            continue

        country.case_data.add(case_data)

    commit()

    print(f"Committed. {errors} errors.")
