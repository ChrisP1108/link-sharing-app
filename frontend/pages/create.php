<?php

    // Goes to create page only if user is not logged in, otherwise user is directed back to preview page

    if (!user_page_authenticate()) {

        Component::header();

        Component::create_login([ 'page' => 'create']);

        Component::footer();
    } else {
        header('Location: /preview');
    }
?>
