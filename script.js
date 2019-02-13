
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

	  // adding custom menu button
    var menuControl = L.Control.extend({

      options: {
        position: 'topleft'
        //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
      },

      onAdd: function (map) {
        var navigation = L.DomUtil.create('nav');
        var container = L.DomUtil.create('div', '', navigation);
        var menu = L.DomUtil.create('button', 'btn btn-info', container);
        var menubutton = L.DomUtil.create('i', 'fas fa-align-left', menu);

        menu.id = 'sidebarCollapse';
        menu.type = 'button';
        menu.accessKey = 'q';

        menu.onclick = function() {
          $('#sidebar').toggleClass('active');
          $('.overlay').toggleClass('active');
          $('.collapse.in').toggleClass('in');
          $('a[aria-expanded=true]').attr('aria-expanded', 'false');
        }

        return container;
      },

    });

    mymap.addControl(new menuControl());

    // creating custom differently sized icons

    var grapes_small = L.icon({
        iconUrl: 'map-icon.png',
        iconSize:     [20, 20], // size of the icon
        iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    var grapes_medium = L.icon({
        iconUrl: 'map-icon.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    var grapes_large = L.icon({
        iconUrl: 'map-icon.png',
        iconSize:     [60, 60], // size of the icon
        iconAnchor:   [30, 30], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    // using fontawesome icons instead of images

    const fontAwesomeIcon = L.divIcon({
        html: '<i class="fas fa-map-marker-alt fa-2x"></i>',
        iconSize: [40, 40],
        iconAnchor: [20,20],
        className: 'myDivIcon'
    });

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

    var all_sensors = L.geoJSON(sensors, {
      onEachFeature: function (feature, layer) {
        //layer.setIcon(fontAwesomeIcon);
        //layer.bindPopup('<h1>'+feature.properties.name+'</h1><p>name: '+feature.properties.subname+'</p>');
        layer.setIcon(grapes_medium);
        layer.bindPopup('<h1>'+feature.properties.name+'</h1><p>name: '+feature.properties.subname+'</p>');
      }
    });

    var markers = L.markerClusterGroup();
    markers.addLayer(all_sensors);

    mymap.addLayer(markers);
    //all_sensors.addTo(mymap);

    //attempting resizing of all markers based on zoom levels
    // highest is level 18, when zoomed all the way in
    // lowest is level 0, where you can see entire world repeated multiple times
    // TODO: determine if this is necessary or how to resize on zoom levels
    mymap.on('zoomend', function() {
        var currentZoom = mymap.getZoom();
        console.log(currentZoom);
        if (currentZoom > 12) {
            //all_sensors.eachLayer(function(layer) {
                //return layer.setIcon(fontAwesomeIcon);
            //});
        } else {
            //all_sensors.eachLayer(function(layer) {
                //return layer.setIcon(fontAwesomeIcon);
            //});
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
        applyButtonClasses: 'apply',
        cancelButtonClasses: 'cancel',
        locale: {
            format: 'M/DD hh:mm A'
        }
    });
    $('input[name="datetimes"]').on('apply.daterangepicker', function(ev, picker) {
        var start = picker.startDate.format('YYYY-MM-DD hh:mm');
        var end   = picker.endDate.format('YYYY-MM-DD hh:mm');
        var params = "start=" + start + "&end=" + end;
        // From StackOverflow: https://stackoverflow.com/questions/406316/how-to-pass-data-from-javascript-to-php-and-vice-versa
        var httpc = new XMLHttpRequest(); // simplified for clarity
        var url = "API.php"; // TODO: CHANGE THIS TO BE THE API LINK
        httpc.open("POST", url, true); // sending as POST

        httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //httpc.setRequestHeader("Content-Length", params.length); // POST request MUST have a Content-Length header (as per HTTP/1.1)

        httpc.onreadystatechange = function() { //Call a function when the state changes.
            if(httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
                alert(httpc.responseText); // some processing here, or whatever you want to do with the response
            }
        };
        httpc.send(params);

    });
});
