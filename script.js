
$(document).ready(function () {
    /*
        Map
    */
    var mymap = L.map('mapid').setView([46.2512, -63.1350], 13);

    // limit zoom level since Charlottetown is not that large
    mymap.options.minZoom = 12;

    //Charlottetown logo
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

    //Contstruction logo
    L.Control.Watermark2 = L.Control.extend({
        onAdd: function(map) {
            var img = L.DomUtil.create('img');

            img.src = 'under-constriction.jpg';
            img.style.width = '200px';

            return img;
        }
    });

    L.control.watermark2 = function(opts) {
        return new L.Control.Watermark2(opts);
    }

    L.control.watermark2({ position: 'bottomright'}).addTo(mymap);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mymap);

    var all_sensors = L.geoJSON(sensors, {
      onEachFeature: function (feature, layer) {
        layer.setIcon(grapes_medium);
        layer.bindPopup('<h1>'+feature.properties.name+'</h1><p>name: '+feature.properties.subname+'</p>');
      }
    });
});
