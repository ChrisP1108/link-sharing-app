<?php

    function get_user_data() {
        $cookie = $_COOKIE[$_ENV['WEB_TOKEN_NAME']] ?? null;
        $id = Token::get_cookie_id($cookie);
        if ($id !== null) {
            $data = DATABASE->get_table_data($id);
            $data['links'] = html_entity_decode($data['links']);
            return json_encode(Controller_Utilities::parse_user_keys($data));
        } else return json_encode(false);
    }