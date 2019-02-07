
$(document).ready(function () {
    /*
        Navbar
        Example code taken and modified from Bootstrapious
    */
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('.overlay').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

    /*
        Map
    */
    var mymap = L.map('mapid').setView([46.2512, -63.1350], 13);

    // trying to create custom icons

    var arduinoIcon = L.icon({
        iconUrl: 'arduino_uno.png',
        iconSize:     [50, 50], // size of the icon
        iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    var arduinoIconSmall = L.icon({
        iconUrl: 'arduino_uno.png',
        iconSize:     [26, 26], // size of the icon
        iconAnchor:   [13, 13], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    //L.marker([46.2512, -63.1350], {icon: arduinoIcon}).addTo(mymap);

    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]).addTo(mymap);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mymap);

    mymap.on("contextmenu", function (event) {
        console.log("user right-clicked on map coordinates: " + event.latlng.toString());
        L.marker(event.latlng).addTo(mymap);
    });

    //add all markers to the map, in sensors.js
    var all_sensors = L.geoJSON(sensors)
    all_sensors.addTo(mymap);

    //attempting resizing of all markers based on zoom levels
    mymap.on('zoomend', function() {
        var currentZoom = mymap.getZoom();
        if (currentZoom > 12) {
            all_sensors.eachLayer(function(layer) {
                return layer.setIcon(arduinoIcon);
            });
        } else {
            all_sensors.eachLayer(function(layer) {
                return layer.setIcon(arduinoIconSmall);
            });
        }
    });
});

/*
    Date picker
    Example code taken from daterangepicker.com
*/
$(function() {
    $('input[name="datetimes"]').daterangepicker({
        timePicker: true,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(32, 'hour'),
        locale: {
        format: 'M/DD hh:mm A'
        }
    });
});
