let map = L.map('map').setView([48.3794, 31.1656], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let mode = null;
let tempLine = [];
let cableSegments = [];
let markers = [];
let currentFeature = null;
let cableStart = null;

function setMode(m) {
  mode = m;
  tempLine = [];
  cableStart = null;
}

map.on('click', function(e) {
  if (mode === 'box' || mode === 'splice') {
    currentFeature = {
      type: mode,
      latlng: e.latlng
    };
    showInputBox();
  } else if (mode === 'cable') {
    if (cableStart === null) {
      cableStart = e.latlng;
    } else {
      const cableEnd = e.latlng;
      const cableType = document.getElementById('cableType').value;

      const polyline = L.polyline([cableStart, cableEnd], {
        color: 'red',
        weight: 3,
        dashArray: '5, 5'
      }).addTo(map);

      polyline.bindPopup(`Кабель: ${cableType} волокон`);
      cableSegments.push({polyline, from: cableStart, to: cableEnd, type: cableType});
      cableStart = null;
    }
  }
});

function showInputBox() {
  document.getElementById('nameInputContainer').classList.remove('hidden');
  document.getElementById('nodeName').focus();
}

function saveNodeName() {
  const name = document.getElementById('nodeName').value;
  if (name && currentFeature) {
    const iconHtml = currentFeature.type === 'box'
      ? `<div style="color: blue; font-weight: bold;">🟥<br>${name}</div>`
      : `<div style="color: green; font-weight: bold;">🔵<br>${name}</div>`;

    const icon = L.divIcon({
      html: iconHtml,
      iconSize: [50, 50],
      className: ''
    });

    const marker = L.marker(currentFeature.latlng, {
      icon: icon,
      draggable: true
    }).addTo(map);

    marker.bindPopup(`${name} (${currentFeature.type})`);

    markers.push({marker, name, type: currentFeature.type});
    currentFeature = null;
  }

  document.getElementById('nodeName').value = '';
  document.getElementById('nameInputContainer').classList.add('hidden');
}
