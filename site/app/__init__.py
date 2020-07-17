from flask import Flask
from datetime import date

app = Flask(__name__)

from app import routes