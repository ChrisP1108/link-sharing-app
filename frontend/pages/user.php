<?php
    Component::header();
?>
        <?php 
            $user_data = get_user_data($id, false);
            if ($user_data !== 'false') {
                Component::mobile_content([
                    'type' => 'user',
                    'data' => json_decode($user_data)
                ]);
            } else {
                echo "<p>No user with the corresponding url id exists</p>";
            }
        ?>
<?php
    Component::footer();
?>   
