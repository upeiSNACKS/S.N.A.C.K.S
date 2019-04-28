var usedIDs;
$(document).ready(function() {
     getIDs("scripts/php/validation.php");
     $('#insertForm').on('submit', function(e) {
         e.preventDefault();
         e.stopPropagation(); // only neccessary if something above is listening to the (default-)event too

         if(validate($('#insertForm'))) {
             $('#insertForm').reset();
         }

    });
});

// Fetches the ID's in the database.
function getIDs(url) {
    // From StackOverflow: https://stackoverflow.com/questions/406316/how-to-pass-data-from-javascript-to-php-and-vice-versa
    // modified a bit though
    var httpc = new XMLHttpRequest(); // simplified for clarity
    httpc.withCredentials = false;

    httpc.open("GET", url, true);
    httpc.setRequestHeader("Content-Type", "application/json");
    httpc.onreadystatechange = function() { //Call a function when the state changes.
        if(httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
            console.log(httpc.responseText);
            usedIDs = JSON.parse(httpc.responseText);
        }
    };
    httpc.send();
}

// Submits the form for approval from the system administrator
function submitForm(url, params) {
    // From StackOverflow: https://stackoverflow.com/questions/406316/how-to-pass-data-from-javascript-to-php-and-vice-versa
    // modified a bit though
    var httpc = new XMLHttpRequest(); // simplified for clarity
    httpc.withCredentials = false;

    httpc.open("POST", url, true);
    httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpc.onreadystatechange = function() { //Call a function when the state changes.
        if(httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
            var data = JSON.parse(httpc.responseText);
            if(data.success){
                swal("Success", "Form submitted!", "success");
            } else {
                swal("Error", data.error, "error");
            }
        } else {
            swal("Error", "form could not be submitted at this time. Please try again later.", "error");
        }
    };
    httpc.send(params);
}

// Called when the form gets submitted. Checks for validity.
function validate(form){
    var fail = "";
    fail += validateID(document.getElementById("sensorID").value)
    fail += validateLat(document.getElementById("lat").value)
    fail += validateLon(document.getElementById("lon").value)
    if (fail == "") {
        fname = document.getElementById("fname").value;
        lname= document.getElementById("lname").value;
        email= document.getElementById("email").value;
        address= document.getElementById("address").value;
        sensor_id= document.getElementById("sensorID").value;
        sensor_lat= document.getElementById("lat").value;
        sensor_lon= document.getElementById("lon").value;
        submitForm("scripts/php/signup.php", "fname=" + fname + "&lname=" + lname + "&email=" + email +
                    "&address=" + address + "&sensorID=" + sensor_id + "&sensor_lat=" + sensor_lat +
                    "&sensor_lon=" + sensor_lon);
        return true;
    } else {
        swal("Error", fail, "error");
        fail = "";
        return false;
     }
}


// Ensures the sensor ID is not already in the database
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
