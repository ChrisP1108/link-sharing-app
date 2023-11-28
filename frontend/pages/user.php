<?php

    // Get user data

    $db_data = get_user_data($id, false);

    $user_data = json_decode($db_data);

    // Loads user data if user found and user saved data.  Otherwise 404 page loaded

    if ($user_data !== 'false' && $user_data->image_url) {

        Component::header();

        Component::mobile_content([
            'type' => 'user',
            'data' => $user_data
        ]);

        Component::footer();

    } else {
        include '404.php';
    }
    

