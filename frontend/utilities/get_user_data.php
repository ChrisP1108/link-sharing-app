<?php

    function get_user_data($id_param = null, $cookie_required = true) {

        if ($id_param === null && $cookie_required) {
            $cookie = $_COOKIE[$_ENV['WEB_TOKEN_NAME']] ?? null;
            $id = Token::get_cookie_id($cookie);
        } else $id = $id_param;

        if ($id !== null && $id !== '' && intval($id) !== 0) {
            $data = DATABASE->get_table_data(intval($id));

            if ($data) {
                $decode_links = html_entity_decode($data['links']);
                $links_data = json_decode($decode_links, true);
                unset($data['links']);
                if($links_data) {
                    foreach ($links_data as $key => $link) {
                        $links_data[$key]['platform'] = htmlspecialchars($link['platform']);
                        $links_data[$key]['link'] = htmlspecialchars($link['link']);
                    }
                } else $links_data = [];
                $parsed_data = Controller_Utilities::parse_user_keys($data);
                $output_data = Sanitize::sanitize_data($parsed_data);
                $output_data['links'] = $links_data;
                return json_encode($output_data);
            } else return json_encode(false);
        } else return json_encode(false);
    }
