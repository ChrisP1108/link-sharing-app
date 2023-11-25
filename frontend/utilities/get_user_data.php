<?php

    function get_user_data($id_param = null, $cookie_required = true) {
        if ($id_param === null && $cookie_required) {
            $cookie = $_COOKIE[$_ENV['WEB_TOKEN_NAME']] ?? null;
            $id = Token::get_cookie_id($cookie);
        } else $id = $id_param;
        if ($id !== null && $id !== '' && intval($id) !== 0) {
            $data = DATABASE->get_table_data(intval($id));
            if ($data) {
                $data['links'] = html_entity_decode($data['links']);
                return json_encode(Controller_Utilities::parse_user_keys($data));
            } else return json_encode(false);
        } else return json_encode(false);
    }