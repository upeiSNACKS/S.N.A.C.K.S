<?php
    require_once 'login.php';
    $min_lat = 46.227094;
    $max_lat = 46.306999;
    $min_lon = -63.140189;
    $max_lat = -63.092608;

    $owners = array();
    $types = array();
    $subtypes = array();
    $sensors = array();
    $connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);
    if($connection->connect_error) die($connection->connect_error);
    $owners_q = "SELECT sensor_owner_email FROM Owners";
    $types_q = "SELECT sensor_type, sensor_subtype FROM Types";
    $sensors_q = "SELECT sensor_id FROM Sensors";

    /*
     * OWNERS GETTING
     */
    $result = $connection->query($owners_q);
    if(!$result) echo "SELECT failed: $owners_q<br>" . $connection->error . "<br><br>";
    $sensor_count = $result->num_rows;
    $rows = $result->num_rows;
    echo "getting owners <br>";
    for($j = 0; $j <$rows; ++$j){
        $result->data_seek($j);
        $row = $result->fetch_array(MYSQLI_NUM);
        $owners[$j] = $row[0];
    }
    // Poll for Sensor IDs
    echo "generating sensors <br>";
    for($j = 0; $j<24; $j++) {
        $email = $owners[rand()%4];
        $id = rand(10, 9999) . '-' . generateRandomString() . '-' . rand(100, 99999);
        $lat = '46.' . rand(2268, 3065);
        $lon = rand(811, 1977);
        if($lon < 1000) { $lon = "0" . $lon;}
        $lon =  '-63.' . $lon;
        $sensor_in = "INSERT INTO Sensors VALUES ('$id', '$email', '$lat', '$lon')";
        $result = $connection->query($sensor_in);
        if(!$result) echo "INSERT INTO failed: $sensor_in<br>" . $connection->error . "<br><br>";
    }
    /*
     * SENSOR_ID GETTING
     */
     echo "getting sensor ID's <br>";
     $result = $connection->query($sensors_q);
     if(!$result) echo "SELECT failed: $sensors_q<br>" . $connection->error . "<br><br>";
     $rows = $result->num_rows;
     for($j = 0; $j <$rows; ++$j){
         $result->data_seek($j);
         $row = $result->fetch_array(MYSQLI_NUM);
         $sensors[$j] = $row[0];
     }
     /*
      * TYPE GETTING
      */
      echo "getting types <br>";
     $result = $connection->query($types_q);
     if(!$result) echo "SELECT failed: $types_q<br>" . $connection->error . "<br><br>";
     $rows = $result->num_rows;
     for($j = 0; $j <$rows; ++$j){
         $result->data_seek($j);
         $row = $result->fetch_array(MYSQLI_NUM);
         $types[$j] = $row[0];
         $subtypes[$j] = $row[1];
     }
     // insert readings
     echo "inserting readings <br>";
     for($j = 0; $j<100; $j++) {
         $type = $types[1];
         $subtype = $subtypes[1];
         $time = generateRandomDate();
         for($i = 0; $i < $sensor_count; $i++) {
             $id = $sensors[$i];
             $reading = rand(-30, 30);
             $reading_in = "INSERT INTO Readings set sensor_id='$id', sensor_type='$type', sensor_subtype='$subtype', sensor_time='$time', sensor_reading='$reading'";
             $result = $connection->query($reading_in);
             if(!$result) echo "INSERT INTO failed: $reading_in<br>" . $connection->error . "<br><br>";
         }
     }

    $connection->close();
    function generateRandomDate() {
        $dateformat = '2019-01-31 18:19:31';
        $year = rand(2015, 2019);
        $month = rand(01, 12);
        switch ($month) {
            case 1:case 3:case 5:case 7:case 8:case 10:case 12:
                $day = rand(1, 31);
                break;
            case 2:
                $day = rand(1, 28);
            case 4:case 6:case 9:case 11:
                $day = rand(1, 30);
            default:
                $day = 1;
        }
        $hour = rand(0, 23);
        $minute = rand(0, 59);
        $sec = rand(0, 59);
		if($month  < 10) { $month  = "0" . $month;}
		if($day    < 10) { $day    = "0" . $day;}
		if($hour   < 10) { $hour   = "0" . $hour;}
		if($minute < 10) { $minute = "0" . $minute;}
		if($sec    < 10) { $sec    = "0" . $sec;}
        return $year . '-' . $month . '-' . $day . ' ' . $hour . ':' . $minute . ':' . $sec;
    }
    function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
?>
