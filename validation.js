function validate(form){
    console.log("VALIDATED");
    fail = validateForename(form.fname.value)
    fail += validateSurname(form.lname.value)
    fail += validateEmail(form.email.value)
    fail += validateSensorID(form.sensorID.value)
    fail += validateLat(form.sensor_lat.value)
    fail += validateLon(form.sensor_lon.value)
    fail += validatecheck(form.dataconsent.checked)
    if (fail == "") {
        swal("Success!", "you did it!", "success");
        return true;
    } else {
        swal("Error", fail, "error");
        return false;
     }
}
function validatecheck(field) {
    if(!field) {
        return "You must consent to the data being publicly available";
    } else {
        return "";
    }
}
function validateForename(field){
    return (field == "") ? "No first name was entered.\n" : ""
}
function validateSurname(field){
    return (field == "") ? "No last name was entered.\n" : ""
}
function validateSensorID(field){
    if (field == "")
        return "No sensor ID  was entered.\n"
    else if (/[^a-zA-Z0-9_-]/.test(field))
        return "Only a-z, A-Z, 0-9, - and _ allowed in sensor ID.\n"
    return ""
}
function validateEmail(field)
{
    if (field == "")
        return "No Email was entered.\n"
    else if (!((field.indexOf(".") > 0) && (field.indexOf("@") > 0)) || /[^a-zA-Z0-9.@_-]/.test(field))
        return "The Email address is invalid.\n"
    return ""
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
        return "Longitute is not within Charlottetown bounds\n"
    }
}
