var myMap = L.map('map', {
    center: [46.29, -112.25],
    zoom: 4
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var queryData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
//var queryData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

function fillScale(mag) {
    switch(true) {
        case mag < 1:
            return "violet";
            break;
        case mag < 2:
            return "blue";
            break;
        case mag < 3:
            return "green";
            break;
        case mag < 4:
            return "yellow";
            break;
        case mag < 5:
            return "orange";
            break;
        default:
            return "red";
    }
}

d3.json(queryData, data => {
    console.log(data.features);
    data.features.forEach(d => {
        L.circleMarker([d.geometry.coordinates[1], d.geometry.coordinates[0]], {
            fillOpacity: 0.2 + d.properties.mag / 10,
            color: 'black',
            weight: 1,
            fillColor: fillScale(d.properties.mag),
            radius: d.properties.mag * 7
        }).bindPopup("Magnitude: " + d.properties.mag
                        + "<br>Location: " + d.properties.place).addTo(myMap);
    });
    
  // Set up the legend
  var legend = L.control({ position: "bottomleft" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0,1,2,3,4,5]
    var colors = ["Violet", "Blue","Green","Yellow","Orange","Red"]
    var labels = ['0-1','1-2','2-3','3-4','4-5','5+'];

    // Add min & max
    var legendInfo = "<h2>Magnitude</h2>"

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      div.innerHTML += "<li style=\"background-color: " + colors[index] + "\">"+labels[index]+"</li>"
    });
    return div;
  };
    legend.addTo(myMap);
});