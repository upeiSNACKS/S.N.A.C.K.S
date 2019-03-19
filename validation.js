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
    fail += validateID(form.sensorID.value)
    fail += validateLat(form.sensor_lat.value)
    fail += validateLon(form.sensor_lon.value)
    if (fail == "") {
        swal("Success!", "you did it!", "success");
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
function validateLat(field) {
    if(field >= 46.2 && field <= 46.3) {
        return "";
    } else {
        return "Latitude is not within Charlottetown bounds\n"
    }
}
function validateLon(field) {
    if(field >= -63.1 && field <= -63.0) {
        return "";
    } else {
        return "Longitude is not within Charlottetown bounds\n"
    }
}
