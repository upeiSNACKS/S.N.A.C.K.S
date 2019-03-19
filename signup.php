<?php
    require_once 'loginPending.php';
    echo "Successfully submitted form. Waiting for approval from an Administrator. Thanks :-) ";

    $connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);
    if($connection->connect_error) die($connection->connect_error);
    $fname = mysqli_real_escape_string($connection, $_POST['fname']);
    $lname = mysqli_real_escape_string($connection, $_POST['lname']);
    $email = mysqli_real_escape_string($connection, $_POST['email']);
    $address = mysqli_real_escape_string($connection, $_POST['address']);
    $sensor_id = mysqli_real_escape_string($connection, $_POST['sensorID']);
    $sensor_lat = mysqli_real_escape_string($connection, $_POST['sensor_lat']);
    $sensor_lon = mysqli_real_escape_string($connection, $_POST['sensor_lon']);
    $query = "INSERT INTO Pending_insert SET fname='$fname', lname='$lname', email='$email', address='$address', sensor_id='$sensor_id', sensor_lat='$sensor_lat', sensor_lon='$sensor_lon'";
    $result = $connection->query($query);
    if(!$result) echo "INSERT INTO failed: $types_q<br>" . $connection->error . "<br><br>";
    $result = $connection->query("SELECT LAST_INSERT_ID()");
    if(!$result) echo "SELECT  failed: $types_q<br>" . $connection->error . "<br><br>";
    $insertID = $result->fetch_array(MYSQLI_NUM)[0];
    echo "$insertID <br><br>";


 ?>
