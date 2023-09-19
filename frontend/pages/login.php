<?php

    // Check if user already logged in.  If so, go directly to preview page.  Otherwise, load login page

    if (user_page_authenticate()) {
        header('Location: /preview');
    } else {
        Component::header();

        Component::create_login([ 'page' => 'login']);

        Component::footer();
    }
?>