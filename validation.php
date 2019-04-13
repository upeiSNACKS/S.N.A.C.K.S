<!--This script will poll the database for all the sensors
    within and return them to the caller in JSON format-->
<?php
    require_once 'loginPending.php';
    $connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);

  	$query = "SELECT sensor_id FROM Sensors";
  	$result = $connection->query($query);

    $out = array();
    for($j = 0; $j <$result->num_rows; ++$j){
         $result->data_seek($j);
         $row = $result->fetch_array(MYSQLI_NUM);
         $out[$j]= $row[0];
    }

    echo json_encode($out);
 ?>
