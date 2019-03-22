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
        // get the info based on the provided ID
        // insert owner to DB.
        //    if fails, that's fine [owner already in db]
        // insert sensor into DB.
        //    should not fail
        //    email person to let them know it's now active?
        //        would go to spam box....
    }
 ?>
