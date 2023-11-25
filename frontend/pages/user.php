<?php

    // Get user data

    $user_data = get_user_data($id, false);

    // Loads user data if user found.  Otherwise 404 page loaded

    if ($user_data !== 'false') {

        Component::header();

        Component::mobile_content([
            'type' => 'user',
            'data' => json_decode($user_data)
        ]);

        Component::footer();

    } else {
        include '404.php';
    }
    

