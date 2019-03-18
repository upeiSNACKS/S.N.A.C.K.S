<?php
    require_once 'loginPending.php';
    echo "Successfully submitted form. Waiting for approval from an Administrator. Thanks :-) ";
    $fname = $_POST['fname'];
    $lname = $_POST['lname'];
    $email = $_POST['email'];
    $address = $_POST['address'];
    $sensor_id = $_POST['sensorID'];
    $sensor_lat = $_POST['sensor_lat'];
    $sensor_lon = $_POST['sensor_lon'];


    $connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);
    if($connection->connect_error) die($connection->connect_error);
 ?>
