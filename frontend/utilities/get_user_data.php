<?php

    function get_user_data() {
        $id = Token::get_cookie_id($_ENV['WEB_TOKEN_NAME']);
        $id = 1;
        if ($id) {
            $data = DATABASE->get_table_data($id);
            return json_encode(Controller_Utilities::parse_user_keys($data));
        } else return json_encode(false);
    }