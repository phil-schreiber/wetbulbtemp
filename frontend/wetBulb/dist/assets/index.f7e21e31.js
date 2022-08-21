(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function c(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=c(e);fetch(e.href,t)}})();document.querySelector("#app").innerHTML=`
  <div>
    <div id="result">
    </div>
    <div class="card">
        <button id = "find-me">Temp for my location</button><br/>
    </div>
  </div>
`;document.querySelector("#find-me").addEventListener("click",s);function s(){const n=document.querySelector("#result");function r(i){const e=i.coords.latitude,t=i.coords.longitude;fetch(`api/${e}/${t}`).then(o=>o.json()).then(o=>n.textContent=o.message)}function c(){n.textContent="Unable to retrieve your location"}navigator.geolocation?(n.textContent="Locating\u2026",navigator.geolocation.getCurrentPosition(r,c)):n.textContent="Geolocation is not supported by your browser"}
