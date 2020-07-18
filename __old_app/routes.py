from app import app
from flask import render_template, jsonify, request
from datetime import date, datetime
from pony.orm import *
import json


@app.route("/")
@app.route("/index")
def index():

    request_date = request.args.get("date")
    if not request_date:
        query_date = date(2020, 7, 16)
    else:
        query_date = datetime.strptime(request_date, "%Y-%m-%d")

    data = get_global_casedata(query_date)

    return render_template("index.html", title="World map", data=data)


@app.route("/country", methods=["GET"])
def country():
    geo_id = request.args.get("c")
    data = get_country_data(geo_id)
    return render_template("country.html",
                           country=data["country_name"]
                           )


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

db.generate_mapping()


@db_session
def get_global_casedata(date=date(2020, 7, 10)):

    query = select(
        (d.geo_id, d.geo_id.name, d.cumulative)
        for d in CaseData
        for c in Country
        if d.date == date)

    result = [["Country", "CountryName", "Cumulative"]]
    for entry in query:
        result.append(
            [entry[0].geo_id, str(entry[1]), entry[2]]
        )
    return result


@db_session
def get_country_data(geo_id, start=None, end=None):
    geo_id = geo_id.upper()

    if not (start or end):
        query = select(
            (d.date, d.cases, d.deaths, d.cumulative)
            for d in CaseData
            for c in Country
            if c.geo_id == geo_id
        )

    return None


@db_session
def get_country_name(geo_id):
    return get(c.name for c in Country if c.geo_id == geo_id)
