<?php

    // Checks if user has valid token to access page.  Returns if authorized, along with user id

    function user_page_authenticate() {

        // Get users from database

        $users = DATABASE->get_table_data();

        // Get cookie that has token, if it exists

        $cookie = $_COOKIE[$_ENV['WEB_TOKEN_NAME']] ?? null;

        // If user has a valid token stored in their cookies, redirect to the 

        if ($cookie && $users && Token::cookie_valid($cookie, $users, $cookie, 'id')) {
            return Token::get_cookie_id($cookie);
        } else {
            Token::remove_cookie($_ENV['WEB_TOKEN_NAME']);
            return false;
        }
    }