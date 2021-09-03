const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoicGF2aWNpIiwiYSI6ImNrdDRkNmZzODA5N2cyeHBsanIweTczaXAifQ.bD3Z2IUiWR8PHuX-00rYGQ';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/pavici/ckt4dbp2e0yjh17mlx28s39k1',
  center: [locations[0].coordinates[0], locations[0].coordinates[1]],
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((location) => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(location.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
    .addTo(map);

  // Extend the map bounds to include the current location
  bounds.extend(location.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
