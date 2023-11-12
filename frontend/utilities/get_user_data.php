<?php

    function get_user_data() {
        $id = Token::get_cookie_id($_ENV['WEB_TOKEN_NAME']);
        $id = 1;
        if ($id) {
            $data = DATABASE->get_table_data($id);
            unset($data['password']);
            return json_encode($data);
        } else return json_encode(false);
    }