<?php

    use PHPMailer\PHPMailer\PHPMailer;

    // Load Composer's autoloader
    require 'vendor/autoload.php';
    /*
     * emailInfo contains values:
     * $to: the email of the person it's going to
     * $toName: the name of the person it's going to
     * $from: email that it's coming from
     * $fromName: name of the coming from
     * $subject: email subject
     * $approveString: A string to signify approval
     * $denyString: A string to signify disapproval
     * $approveHash: Hash of approval string
     * $denyString: Hash of deny string
     */
    require_once 'emailInfo.php';
    /*
     * loginPending contains values:
     * $db_database - name of database
     * $db_hostname - where the database is located (A url for instance)
     * $db_password - users password
     * $db_username - username for db
     */
    require_once 'loginPending.php';

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
    // Instantiation and passing `true` enables exceptions
    $mail = new PHPMailer(true);

    $mail->setFrom($from, $fromName);
    $mail->addAddress($to, $toName);
    $mail->isHTML(true);
    // Link to snacks.* for approve:
    //     send along the $insertID, and a string meaning approval.
    $mail->Subject = $subject;
    $mail->Body = <<<__END
    Hi!
        <p>Looks like someone submitted a form for becoming a host of a sensor in SNACKS!</p>
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
        <div class="btn-group" role="group">
            <form action="snackswebsite-env.pvpbuh8a6r.us-east-2.elasticbeanstalk.com/formResponse.php?id=$insertID&approved=$approve">
                <input type="submit" value="Approve" />
            </form>
            <form action="snackswebsite-env.pvpbuh8a6r.us-east-2.elasticbeanstalk.com/formResponse.php?id=$insertID&approved=$deny">
                <input type="submit" value="Deny" />
            </form>
        </div>
__END;
    if(!$mail->send()) {
      echo 'Message was not sent.';
      echo 'Mailer error: ' . $mail->ErrorInfo;
    } else {
        echo "Successfully submitted form. Waiting for approval from an Administrator. Thanks :-) ";
    }

 ?>
