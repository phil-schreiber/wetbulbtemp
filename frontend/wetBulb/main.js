import './style.css'
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';


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

function geoFindMe() {

    const status = document.querySelector('#result');

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
    const status = document.querySelector('#result');
    fetch(`api/${latitude}/${longitude}`)
        .then((res) => {
        return res.json()
        })
        .then(data => status.textContent = data.message)
}

const autocomplete = new GeocoderAutocomplete(
document.getElementById("autocomplete"),
'370188ec3a8b4ce58084294d699036bf',
{ /* Geocoder options */ });

autocomplete.on('select', (location) => {
    fetchTemp(location.properties.lat, location.properties.lon);
});