<!--

SNACKS - A LoRaWAN based sensor network designed to monitor environmental
data around the City of Charlottetown, PE, Canada.

Copyright (C) 2019 Jeremy Thompson, R.J. Arsenault, Alec Metcalfe, Eduardo Egger

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

The best way to contact a developer is by email or via a pull request
on the GitHub page:

https://github.com/upeiSNACKS/snacks

jhthompson@upei.ca
rparsenault@upei.ca
almetcalfe@upei.ca
eegger@upei.ca

-->

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
        <table style="margin-left:10px">
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
        <p> If you approve, click the button below and it will be automatically added to the system. If you do not approve, please respond to <b>$email</b> and explain why not.
        <div class="btn-group" role="group">
            <form action="snackswebsite-env.pvpbuh8a6r.us-east-2.elasticbeanstalk.com/formResponse.php" method="get">
                <input type=hidden name="id" value="$insertID">
                <input type=hidden name="approved" value="$approve">
                <input type="submit" value="Approve"/>
            </form>
        </div>
        <p>You will also have to add this sensor to the Things Network as well before it becomes active.</p>
__END;
    if(!$mail->send()) {
      echo 'Message was not sent.';
      echo 'Mailer error: ' . $mail->ErrorInfo;
    } else {
        echo "Successfully submitted form. Waiting for approval from an Administrator. Thanks :-) ";
    }

 ?>
