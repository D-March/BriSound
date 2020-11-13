mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: event.geometry.coordinates, // starting position [lng, lat]
    zoom: 15 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(event.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${event.title}</h3><p>${event.location}</p>`
        )
    )
    .addTo(map)

// map.on('load', function () {
//     map.loadImage(
//     'https://i.imgur.com/UBRy201.png',
//     function (error, image) {
//     if (error) throw error;
//     map.addImage('marker', image);
//     map.addSource('point', {
//     'type': 'geojson',
//     'data': {
//     'type': 'FeatureCollection',
//     'features': [
//     {
//     'type': 'Feature',
//     'geometry': {
//     'type': 'Point',
//     'coordinates': event.geometry.coordinates
//     }
//     }
//     ]
//     }
//     });
//     map.addLayer({
//     'id': 'points',
//     'type': 'symbol',
//     'source': 'point',
//     'layout': {
//     'icon-image': 'marker',
//     'icon-size': 0.1
//     }
//     });
//     }
//     );
//     });
