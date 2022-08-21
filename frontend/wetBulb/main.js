import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <div id="result">
    </div>
    <div class="card">
        <button id = "find-me">Temp for my location</button><br/>
    </div>
  </div>
`

document.querySelector('#find-me').addEventListener('click', geoFindMe);

function geoFindMe() {

    const status = document.querySelector('#result');

    function success(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;

      fetch(`api/${latitude}/${longitude}`)
        .then((res) => {
        return res.json()
        })
        .then(data => status.textContent = data.message)
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

