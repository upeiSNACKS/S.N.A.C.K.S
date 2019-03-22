<?php
    if(isset($_GET['id'])) {
        $insertID = mysqli_real_escape_string($_GET['id']);
    } else {
        echo "invalid parameters. ";
    }
    if(isset($_GET['approved'])) {
        $approval = mysqli_real_escape_string($_GET['approved']);
    } else {
        echo "Invalid parameters.";
    }

    if(password_verify($approval, "IAPPROVETHISINSERT")) {
        
    }
 ?>
