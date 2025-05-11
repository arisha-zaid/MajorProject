// Ensure mapToken is correctly set as the Mapbox access token
mapboxgl.accessToken = mapToken;

console.log(coordinates);

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({ color: '#fe424d' })
  .setLngLat(coordinates) // Use the correct coordinates
  .setPopup(new mapboxgl.Popup({offset: 25}) .setHTML(
    "<p>Exact location will be provided on booking!</p>"
    ))
  .addTo(map);
