mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    center: campground.geometry.coordinates,
    zoom: 12
});

// Set marker options.
const marker = new mapboxgl.Marker({
    color: "#FF0000",
}).setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${campground.title}</h3>`)
    )
    .addTo(map);

console.log(campground.geometry.coordinates);