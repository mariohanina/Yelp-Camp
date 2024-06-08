mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    center: coordinates,
    zoom: 12
});

// Set marker options.
const marker = new mapboxgl.Marker({
    color: "#FF0000",
}).setLngLat(coordinates)
    .addTo(map);

console.log(coordinates);