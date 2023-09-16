<?php

    function get_user_data() {
        $id = Token::get_cookie_id($_ENV['WEB_TOKEN_NAME']);
        if ($id) {
            $data = DATABASE->get_table_data();
            return json_encode($data);
        } else return json_encode(false);
    }