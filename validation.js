$(document).ready(function() {
    /**
     * This function uses AJAX to populate a JSON array which gets used by our leaflet map
     */
     var usedIDs;
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
    var failMessage = "";
    $('#sensorID').on('blur', function() {
        var contents = $('#sensorID').val();
        var valid = true;
        for(var i = 0;i<usedIDs.length && valid; i++) {
            if(contents == usedIDs[i]) {
                failMessage += "Invalid sensor ID - Already in use\n";
                valid = false;
            }
        }
    });

    $('#sensor_lat').on('blur', function() {
        var contents = $('#sensor_lat').val();
        if(contents < 46.227094 || contents > 46.306999) {
            failMessage += "Latitude is outside of Charlottetown city bounds\n";
        }
    });
    $('#sensor_lon').on('blur', function() {
        var contents = $('#sensor_lon').val();
        if(contents < -63.140189 || contents > -63.092608) {
            failMessage += "Longitude is outside of Charlottetown city bounds\n";
        }
    });
    $('#insertForm').submit(function() {
        if(failMessage === "") {
            swal("Error", failMessage, "error");
        }
    })

});
