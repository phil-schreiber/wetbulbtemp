import os
from flask import Flask, jsonify, request, redirect, send_from_directory
from flask_cors import CORS, cross_origin
import json
import requests
import numpy as np
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('API_KEY')

app = Flask(__name__, static_folder='frontend/wetBulb/dist', static_url_path='')

CORS(app)

weather_url = 'https://api.openweathermap.org/data/2.5/weather?lat={}&lon={}&units=metric&appid={}'
dummy = '{"coord":{"lon":7.0691,"lat":50.9616},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"base":"stations","main":{"temp":300.00,"feels_like":296.9,"temp_min":294.78,"temp_max":299.25,"pressure":1017,"humidity":43},"visibility":10000,"wind":{"speed":3.09,"deg":110},"clouds":{"all":0},"dt":1660289038,"sys":{"type":2,"id":2005976,"country":"DE","sunrise":1660277636,"sunset":1660330789},"timezone":7200,"id":2900063,"name":"Holweide","cod":200}'

@app.before_request
def before_request():
    if not request.is_secure:
        url = request.url.replace('http://', 'https://', 1)
        code = 301
        return redirect(url, code=code)

@app.route('/api/<string:lat>/<string:lon>', methods=['GET'])
@cross_origin()
def index(lat, lon):
    lat = float(lat)
    lon = float(lon)
    r = requests.get(weather_url.format(lat, lon, API_KEY))
    rjson = r.json()
    weather_main = rjson['main'];
    t = weather_main['temp']
    rh = weather_main['humidity']

    wet_bulb_tmp_c = round(formulas.calc_wet_bulb_tmp(t, rh), 2)
    wet_bulb_tmp_f = round(wet_bulb_tmp_c * 1.8, 0) + 32
    m = f'{wet_bulb_tmp_c} °C / {wet_bulb_tmp_f} °F'
    res = {
        'message': m,
        'temp': t,
        'rh': rh
    }
    response = jsonify(res)

    return response

@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')

class formulas:
    def calc_wet_bulb_tmp(t: int, rh: int):

        a = np.arctan((0.151977 * np.power(rh+8.313659, 0.5)))
        b = np.arctan((t+rh))
        c = np.arctan((rh-1.676331))
        d = 0.00391838 * np.power(rh, 1.5)
        e = np.arctan((0.023101 * rh))

        return t*a + b - c + (d*e) - 4.686035