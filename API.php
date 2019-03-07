<?php
    if(isset($_POST['start'])) {
        echo SanitizeString($_POST['start']);
        echo "<br>";
    }
    if(isset($_POST['end'])) {
        echo SanitizeString($_POST['end']);
    }

    function SanitizeString($var) {
        $var = strip_tags($var);
        $var = htmlentities($var);
        return stripslashes($var);
    }
 ?>
