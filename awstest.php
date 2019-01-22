<?php
    require_once 'login.php';
    $connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);
    if($connection->connect_error) die($connection->connect_error);

    $query = "select * from owners";
    $result = $connection->query($query);

    $rows = $result->num_rows;
    for($i = 0; $i<$rows; $i++) {
        $result->data_seek($i);
        $row = $result->fetch_array(MYSQLI_NUM);

        Echo "--------------- <br>";
        echo "$row[0] $row[1] $row[2] <br>";

    }

 ?>
