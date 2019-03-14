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



    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mymap);
    setMap(mymap);
    // disable clustering once zoomed in close enough
    var markers = L.markerClusterGroup({ disableClusteringAtZoom: 15 });
    setLayer(markers);
    ajax("?start_time=now");

    //attempting resizing of all markers based on zoom levels
    // highest is level 18, when zoomed all the way in
    // lowest is level 0, where you can see entire world repeated multiple times
    // TODO: determine if this is necessary or how to resize on zoom levels
    mymap.on('zoomend', function() {
        var currentZoom = mymap.getZoom();
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
var globalMap;
var layer;
function setLayer(l) {
    layer = l;
}
function getLayer() {
    return layer;
}
function setMap(map) {
    globalMap = map;
}
function getMap() {
    return globalMap;
}
function constructPopupHTML(feature) {
  $("#popup_template #title").html(feature.properties.name);

  // This currently has hardcoded HTML objects in it. Want it to somehow
  // Create these dynamically based on the types that we get.
  $("#popup_template #last_measurement").html(feature.properties.reading_time);
  $("#popup_template #humidity").html(feature.properties.readings.filter(function(a) {
      return a.type=="Humidity";
  })[0].reading);
  $("#popup_template #temperature").html(feature.properties.readings.filter(function(a) {
      return a.type=="Temperature";
  })[0].reading);
  return $("#popup_template").html();
}
/**
 * This function uses AJAX to populate a JSON array which gets used by our leaflet map
 */
function ajax(params) {
    // From StackOverflow: https://stackoverflow.com/questions/406316/how-to-pass-data-from-javascript-to-php-and-vice-versa
    var httpc = new XMLHttpRequest(); // simplified for clarity
    httpc.withCredentials = false;
    if (params.indexOf("?") != 0) {
        params = "?" + params;
    }
    var url = "https://jm6ctx1smj.execute-api.us-east-2.amazonaws.com/beta/DBapiAccess" + params;
    httpc.open("GET", url, true);
    console.log(url);
    httpc.setRequestHeader("Content-Type", "application/json");

    httpc.onreadystatechange = function() { //Call a function when the state changes.
        if(httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
            var receivedJSON = JSON.parse(httpc.responseText);
            //console.log(receivedJSON.length);
            var modifiedJSON = [];
            for(var i = 0; i<receivedJSON.length; i++) {
                // If we don't have this SensorID already in our GEOJSON, we create a new GEOJSON object for it
                if(!checkThere(modifiedJSON, receivedJSON[i])) {
                    var newObj = {  "type": "Feature",
                                    "properties": {
                                        "name": receivedJSON[i].sensor_id,
                                        "reading_time" : receivedJSON[i].reading_time,
                                        // An array of readings, to hold every reading over the time period that we received
                                        "readings": [
                                            {"type": receivedJSON[i].sensor_type,
                                             "subtype": receivedJSON[i].sensor_subtype,
                                             "reading": receivedJSON[i].reading}
                                        ]},
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [
                                            receivedJSON[i].sensor_lon,
                                            receivedJSON[i].sensor_lat
                                        ]
                                    }
                                };
                    modifiedJSON.push(newObj)
                }
            }
            sensors=modifiedJSON;
            var map = getMap();
            var all_sensors = L.geoJSON(sensors, {
              onEachFeature: function (feature, layer) {
                layer.setIcon(grapes_medium);
                layer.bindPopup(
                  constructPopupHTML(feature)
                );
              }
            });
            var markers = L.markerClusterGroup({ disableClusteringAtZoom: 15 });
            map.removeLayer(getLayer());
            markers.addLayer(all_sensors);

            map.addLayer(markers);
        }
    };
    httpc.send();
}
/*
 * This function checks our list of GEOJSON objects to see if the sensorID already
 * has an element. If it does we take the reading and put it in the sensorID's object
 */
function checkThere(list, obj) {
    for(var i = 0; i<list.length; i++) {
        if(obj.sensor_id == list[i].properties.name) {
            list[i].properties.readings.push({
                "type": obj.sensor_type,
                "subtype": obj.sensor_subtype,
                "reading": obj.reading});
            return true;
        }
    }
    return false;
}
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
        var params = "?start_time=" + start + "&end_time=" + end;
        ajax(params);

    });
});
