<?php

    function get_user_data() {
        $id = Token::get_cookie_id($_ENV['WEB_TOKEN_NAME']);
        if ($id) {
            return DATABASE->get_table_data();
        } else return false;
    }