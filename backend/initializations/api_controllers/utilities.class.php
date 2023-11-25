<?php

    // API Utility Methods

    class Controller_Utilities {

        // Handle body input error on POST and PUT Requests

        static function input_invalid($body) {
            if (!$body || empty($body['login_email']) || empty($body['password'])) {
                return [
                    'status' => 400,
                    'msg' => 'A request body must be passed in with a login_email and password keys and values at a minimum.'
                ];
            } 

            return false;
        }

        // Check if emails match

        static function emails_match($a, $b) {
            return strtolower($a) === strtolower($b);
        }

        // Hash Password for POST and PUT Requests

        static function hash_password($password = null) {
            if ($password) {

                $options = [
                    'cost' => 13
                ];

                return password_hash($password, PASSWORD_BCRYPT, $options);
            }
        }

        // Get Date Time

        static function get_date_time() {
            return date("Y-m-d H:i:s");
        }

        // Parse user keys

        static function parse_user_keys($user) {

            $user['id'] = intval($user['id']);
            $user['times_logged_in'] = intval($user['times_logged_in']);
            unset($user['password']);
            return $user;
        }

        // Generate token

        static function generate_token($user) {
            Token::generate_set_cookie([
                'name' => $_ENV['WEB_TOKEN_NAME'],
                'id' => $user['id'],
                'role' => $_ENV['WEB_TOKEN_NAME'],
                'expiration' => time() + 604800,
                'secure' => true,
                'http_only' => true
            ]);
        }

        // Authorized User

        static function authorized_user($data) {

            // Make sure user has valid token

            return Token::cookie_valid($_COOKIE[$_ENV['WEB_TOKEN_NAME']], $data, $_ENV['WEB_TOKEN_NAME'], 'id') ?? false;
        }

        // Get Token Id

        static function token_id() {
            $cookie = $_COOKIE[$_ENV['WEB_TOKEN_NAME']] ?? null;
            return Token::get_cookie_id($cookie);
        }

        // Check if token exists

        static function token_exists() {
            $cookie = $_COOKIE[$_ENV['WEB_TOKEN_NAME']] ?? false;
            if (!$cookie) {
                return false;
            } else return true;
        }

        // Unauthorized message

        static function unauthorized_bad_token() {
            Token::remove_cookie($_ENV['WEB_TOKEN_NAME']);
            return [
                'status' => 401,
                'msg' => 'Unauthorized. Invalid token.'
            ];
        }

        // No token, unauthorized message

        static function unauthorized_no_token() {
            return [
                'status' => 401,
                'msg' => 'Unauthorized. No token.'
            ];
        }

        // Error getting user data during authentication

        static function error_authentication() {
            return [
                'status' => 500,
                'msg' => 'Error getting user data during authentication.'
            ];
        }
    }