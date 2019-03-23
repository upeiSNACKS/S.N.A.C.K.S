<?php
    require_once 'emailInfo.php';
    require_once 'loginPending.php';
    $connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);
    if($connection->connect_error) die($connection->connect_error);
    if(isset($_GET['id'])) {
        $insertID = mysqli_real_escape_string($connection, $_GET['id']);
    } else {
        echo "invalid parameters: id: " . $_GET['id'];
        exit();
    }
    if(isset($_GET['approved'])) {
        $approval = mysqli_real_escape_string($connection, $_GET['approved']);
    } else {
        echo "Invalid parameters. approved:" . $_GET['approved'];
        exit();
    }

    if(password_verify($approveString, $approval)) {
        // get the info based on the provided ID

        $query = "SELECT * FROM Pending_insert WHERE insertID=$insertID";
        $result = $connection->query($query);
        if(!$result) {
            echo "Error selecting from database: $connection->error";
        }
        $data = $result->fetch_array(MYSQLI_NUM);
        $fname = $data[0];$lname = $data[1];$email = $data[2];$address = $data[3];
        $sensor_id = $data[4];$sensor_lat = $data[5];$sensor_lon = $data[6];

        $query = "INSERT INTO Owners VALUES ('$email','$fname', '$lname','$address');";
        $result = $connection->query($query);
        //Don't care if it fails - just means it's in the db already
        $query = "INSERT INTO Sensors VALUES ('$sensor_id','$email', '$sensor_lat','$sensor_lon');";
        $result = $connection->query($query);
        if(!$result) {
            echo "Error inserting to database: $query<br> $connection->error<br><br>";
            echo <<<__END
            Please enter manually:
            <table>
                <tr><th>Person</th></tr>
                <tr>
                    <td><b>Name</b></td><td>$lname, $fname</td>
                </tr>
                <tr>
                    <td><b>Email</b></td><td>$email</td>
                </tr>
                <tr>
                    <td><b>Address</b></td><td>$address</td>
                </tr>
                <tr>
                    <th>Sensor</th>
                </tr>
                <tr>
                    <td><b>Sensor ID</b></td><td>$sensor_id</td>
                </tr>
                <tr>
                    <td><b>Latitude</b></td><td>$sensor_lat</td>
                </tr>
                <tr>
                    <td><b>Longitude</b></td><td>$sensor_lon</td>
                </tr>
            </table>

__END;

        } else {
            echo "Successfully inserted Sensor. Welcome :)";
        }
    } else {
        echo "not approved." . password_verify($approval, $approveString);
    }
 ?>
