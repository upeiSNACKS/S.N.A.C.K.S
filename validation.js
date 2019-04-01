/*

SNACKS - A LoRaWAN based sensor network designed to monitor environmental
data around the City of Charlottetown, PE, Canada.

Copyright (C) 2019 Jeremy Thompson, R.J. Arsenault, Alec Metcalfe, Eduardo Egger

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

The best way to contact a developer is by email or via a pull request
on the GitHub page:

https://github.com/upeiSNACKS/snacks

jhthompson@upei.ca
rparsenault@upei.ca
almetcalfe@upei.ca
eegger@upei.ca

*/

var usedIDs;
$(document).ready(function() {
    /**
     * This function uses AJAX to populate a JSON array which gets used by our leaflet map
     */
     ajax("");
    function ajax(params) {
        // From StackOverflow: https://stackoverflow.com/questions/406316/how-to-pass-data-from-javascript-to-php-and-vice-versa
        var httpc = new XMLHttpRequest(); // simplified for clarity
        httpc.withCredentials = false;

        var url = "validation.php";
        httpc.open("POST", url, true);
        httpc.setRequestHeader("Content-Type", "application/json");
        httpc.onreadystatechange = function() { //Call a function when the state changes.
            if(httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
                usedIDs = JSON.parse(httpc.responseText);
            }
        };
        httpc.send();
    }
    $('#sensorID').on('blur', function() {
        var contents = $('#sensorID').val();

    });

});
var fail = "";
function validate(form){
    fail += validateID(form.elements.namedItem("sensorID").value)
    fail += validateLat(form.elements.namedItem("lat").value)
    fail += validateLon(form.elements.namedItem("lon").value)
    if (fail == "") {
        console.log("FO0RM");
        swal("Success!", "you did nothing!", "success");
        return true;
    } else {
        swal("Error", fail, "error");
        fail = "";
        return false;
     }
}
function validateID(field) {
    var valid = true;
    for(var i = 0;i<usedIDs.length && valid; i++) {
        if(field == usedIDs[i]) {
            return "Invalid sensor ID - ID already in use!\n"
            valid = false;
        }
    }
    return "";
}
// https://ruk.ca/content/prince-edward-island-gis-numbers
// Thanks peter!
// lonmin,latmin: -64.4534,45.9353
// lonmax,latmax -61.9494,47.0668
function validateLat(field) {
    if(field >= 45.9353 && field <= 47.0668) {
        return "";
    } else {
        return "Latitude is not within Charlottetown bounds\n"
    }
}
function validateLon(field) {
    if(field >= -64.4534 && field <= -61.9494) {
        return "";
    } else {
        return "Longitude is not within Charlottetown bounds\n"
    }
}
