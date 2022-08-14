import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'
import { setUpMap } from './map.js'

document.querySelector('#app').innerHTML = `
  <div>
    <div id="map">
    </div>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
  </div>
`

setupCounter(document.querySelector('#counter'))
const map = setUpMap(document.querySelector('#map'))
