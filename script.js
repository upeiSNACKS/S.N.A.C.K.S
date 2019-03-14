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
    
    $('#help').on('click', function () {
       window.open('help.html', '_blank'); 
    });

    /*
        Map
    */
    var mymap = L.map('mapid').setView([46.2512, -63.1350], 13);
    
    // limit zoom level since Charlottetown is not that large
    mymap.options.minZoom = 12;

    // sometimes bounce will break grouping fnctionality - so disable it
    mymap.options.bounceAtZoomLimits = false;

    var timeControl = L.Control.extend({

        options: {
            position: 'topright'
            //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
        },

        onAdd: function (map) {
            var navigation = L.DomUtil.create('nav');
            var container = L.DomUtil.create('div', 'timecontrol', navigation);
            var timepicker = L.DomUtil.create('input', '', container);
            timepicker.name = 'datetimes';
            timepicker.id = 'timepicker';
            timepicker.type = 'input';
            timepicker.accessKey = 't';

            return container;
        },

    });

    mymap.addControl(new timeControl());

    L.Control.Watermark = L.Control.extend({
        onAdd: function(map) {
            var img = L.DomUtil.create('img');

            img.src = 'Charlottetown_Logo.png';
            img.style.width = '200px';

            return img;
        }
    });

    L.control.watermark = function(opts) {
        return new L.Control.Watermark(opts);
    }

    L.control.watermark({ position: 'bottomleft'}).addTo(mymap);

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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mymap);

    //From: https://leafletjs.com/examples/choropleth/
    function getColor(d) {
        return d > 1000 ? '#800026' :
               d > 500  ? '#BD0026' :
               d > 200  ? '#E31A1C' :
               d > 100  ? '#FC4E2A' :
               d > 50   ? '#FD8D3C' :
               d > 20   ? '#FEB24C' :
               d > 10   ? '#FED976' :
                          '#FFEDA0';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.density),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    L.geoJson(sensors, {style: style}).addTo(mymap);

    // var all_sensors = L.geoJSON(sensors, {
    //   onEachFeature: function (feature, layer) {
    //     //layer.setIcon(fontAwesomeIcon);
    //     //layer.bindPopup('<h1>'+feature.properties.name+'</h1><p>name: '+feature.properties.subname+'</p>');
    //     layer.setIcon(grapes_medium);
    //     layer.bindPopup(
    //       constructPopupHTML(feature)
    //     );
    //   }
    // });

    // function constructPopupHTML(feature) {
    //   $("#popup_template #title").html(feature.properties.name);

    //   //TODO: however our API call fetches dat will determine how data is displayed in these popups
    //   $("#popup_template #last_measurement").html('2019-01-01 12:00');
    //   $("#popup_template #temperature").html('4.4⁰C');
    //   $("#popup_template #humidity").html('50%');

    //   //$("#popup_template").removeAttr('style');
    //   return $("#popup_template").html();
    // }
    // // disable clustering once zoomed in close enough
    // var markers = L.markerClusterGroup({ disableClusteringAtZoom: 15 });
    // markers.addLayer(all_sensors);

    // mymap.addLayer(markers);
    // all_sensors.addTo(mymap);

    // //attempting resizing of all markers based on zoom levels
    // // highest is level 18, when zoomed all the way in
    // // lowest is level 0, where you can see entire world repeated multiple times
    // // TODO: determine if this is necessary or how to resize on zoom levels
    // mymap.on('zoomend', function() {
    //     var currentZoom = mymap.getZoom();
    //     if (currentZoom > 12) {
    //         //all_sensors.eachLayer(function(layer) {
    //             //return layer.setIcon(fontAwesomeIcon);
    //         //});
    //     } else {
    //         //all_sensors.eachLayer(function(layer) {
    //             //return layer.setIcon(fontAwesomeIcon);
    //         //});
    //     }
    // });
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
        // POST request MUST have a Content-Length header (as per HTTP/1.1)

        httpc.onreadystatechange = function() { //Call a function when the state changes.
            if(httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
                alert(httpc.responseText); // some processing here, or whatever you want to do with the response
            }
        };
        httpc.send(params);

    });
});