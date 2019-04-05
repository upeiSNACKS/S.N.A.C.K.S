var usedIDs;
$(document).ready(function() {
     getIDs("validation.php");
});
function getIDs(url) {
    // From StackOverflow: https://stackoverflow.com/questions/406316/how-to-pass-data-from-javascript-to-php-and-vice-versa
    // modified a bit though
    var httpc = new XMLHttpRequest(); // simplified for clarity
    httpc.withCredentials = false;

    httpc.open("POST", url, true);
    httpc.setRequestHeader("Content-Type", "application/json");
    httpc.onreadystatechange = function() { //Call a function when the state changes.
        if(httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
            usedIDs = JSON.parse(httpc.responseText);
        }
    };
    httpc.send();
}
function submitForm(url, params) {
    // From StackOverflow: https://stackoverflow.com/questions/406316/how-to-pass-data-from-javascript-to-php-and-vice-versa
    // modified a bit though
    var httpc = new XMLHttpRequest(); // simplified for clarity
    httpc.withCredentials = false;

    httpc.open("POST", url, true);
    httpc.setRequestHeader("Content-Type", "application/json");
    httpc.onreadystatechange = function() { //Call a function when the state changes.
        if(httpc.readyState == 4 && httpc.status == 200) { // complete and no errors
            swal("Success", "Form submitted!", "success");
        } else {
            swal("Error", "form could not be submitted at this time. Please try again later.", "error");
        }
    };
    httpc.send(params);
}
var fail = "";
function submit(form){
    fail += validateID(form.elements.namedItem("sensorID").value)
    fail += validateLat(form.elements.namedItem("lat").value)
    fail += validateLon(form.elements.namedItem("lon").value)
    if (fail == "") {
        fname = form.elements.namedItem("fname").value;
        lname= form.elements.namedItem("lname").value;
        email= form.elements.namedItem("email").value;
        address= form.elements.namedItem("address").value;
        sensor_id= form.elements.namedItem("sensorID").value;
        sensor_lat= form.elements.namedItem("lat").value;
        sensor_lon= form.elements.namedItem("lon").value;
        submitForm("signup.php", "fname=fname&=lname&email=email&address=address&sensor_id=sensor_id&sensor_lat=sensor_lat&sensor_lon=sensor_lon");
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
