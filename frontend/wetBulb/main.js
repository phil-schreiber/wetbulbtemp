import './style.css'
import * as L from "leaflet";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import './lib/leaflet-openweathermap.js'



document.querySelector('#app').innerHTML = `
    <div class="card">
        Wet-bulb temperature:
        <div id="result">
        Choose location first
        </div><br />
        <div id="autocomplete" class="autocomplete-container"></div><br />
        <button id = "find-me">Temp for my location</button><br/>
    </div>
`

document.querySelector('#find-me').addEventListener('click', geoFindMe);
const status = document.querySelector('#result');
function geoFindMe() {

    function success(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;

        fetchTemp(latitude, longitude);

    }

    function error() {
      status.textContent = 'Unable to retrieve your location';
    }

    if (!navigator.geolocation) {
      status.textContent = 'Geolocation is not supported by your browser';
    } else {
      status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }

  }

function fetchTemp(latitude, longitude) {
    status.textContent = 'Fetching wet-bulb temperature... please wait'
    fetch(`api/${latitude}/${longitude}`)
        .then((res) => {
        return res.json()
        })
        .then(data => status.textContent = data.message)
        .error(() => status.textContent = 'Sorry, no luck fetching the requested wet-bulb temperature. Try again with a different location.')
}

const autocomplete = new GeocoderAutocomplete(
document.getElementById("autocomplete"),
'370188ec3a8b4ce58084294d699036bf',
{ /* Geocoder options */ });

autocomplete.on('select', (location) => {
    fetchTemp(location.properties.lat, location.properties.lon);
});

var osm = L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=13ee4c06d5a78af0ec0caf430d5bed77', {
	maxZoom: 18, attribution: '[insert correct attribution here!]' });


var clouds = L.OWM.clouds({showLegend: false, opacity: 0.5, appId: '13ee4c06d5a78af0ec0caf430d5bed77'});
var city = L.OWM.current({intervall: 15, lang: 'de'});

var map = L.map('map', { center: new L.LatLng(51.5, 10), zoom: 10, layers: [osm] });
var baseMaps = { "OSM Standard": osm };
var overlayMaps = { "Clouds": clouds, "Cities": city };
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);