// Include Leaflet.js and CSS
const leafletScript = document.createElement('script');
leafletScript.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
document.head.appendChild(leafletScript);

const leafletStylesheet = document.createElement('link');
leafletStylesheet.rel = 'stylesheet';
leafletStylesheet.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
document.head.appendChild(leafletStylesheet);

// Wait for Leaflet to load
leafletScript.onload = () => {
  // Initialize the map
  const map = L.map('map').setView([15, 39], 6); // Centered on Eritrea

  // Basemaps
  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Custom Marker (Asmara)
  const asmaraIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  L.marker([15.338, 38.931], { icon: asmaraIcon })
    .addTo(map)
    .bindPopup("<b>Asmara</b><br>Capital of Eritrea");

  // Function to fetch and display districts
  const fetchDistricts = () => {
    const queryUrl = 'http://localhost:8080/geoserver/subcounty/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=subcounty:eritrea_adm2&outputFormat=application/json';

    fetch(queryUrl)
      .then(response => response.json())
      .then(data => {
        if (data.features.length > 0) {
          // Extract unique districts from 'name_2' attribute
          const districts = Array.from(new Set(data.features.map(feature => feature.properties.name_2)));

          // Show all districts on the map
          L.geoJSON(data, {
            style: {
              color: 'green', // Change color for districts
              weight: 2
            },
            onEachFeature: (feature, layer) => {
              layer.bindPopup(`<b>District:</b> ${feature.properties.name_2}`);
            }
          }).addTo(map);

          // Create a legend to display districts (Optional)
          const legend = L.control({ position: 'topright' });

          legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');
            div.innerHTML = '<strong>Districts</strong><br>';
            districts.forEach(district => {
              div.innerHTML += `<i style="background:green"></i> ${district}<br>`;
            });
            return div;
          };

          legend.addTo(map);
        } else {
          console.error('No features found for fetching districts.');
        }
      })
      .catch(error => console.error('Error fetching district data:', error));
  };

  // Call the function to fetch and display districts
  fetchDistricts();
};
