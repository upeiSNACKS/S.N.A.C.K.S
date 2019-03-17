<?php
    require_once 'loginPendng.php';
    echo "Successfully submitted form. Waiting for approval from an Administrator. Thanks :-) ";
    $fname = $_POST['fname'];
    $lname = $_POST['lname'];
    $email = $_POST['email'];
    $address = $_POST['address'];
    $sensor_id = $_POST['sensorID'];
    $sensor_lat = $_POST['sensor_lat'];
    $sensor_lon = $_POST['sensor_lon'];

 ?>
