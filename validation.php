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
