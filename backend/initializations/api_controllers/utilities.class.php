<?php

    // API Utility Methods

    class Controller_Utilities {

        // Handle body input error on POST and PUT Requests

        static public function input_invalid($body) {
            if (!$body || empty($body['login_email']) || empty($body['password'])) {
                return [
                    'status' => 400,
                    'msg' => 'A request body must be passed in with a login_email and password keys and values at a minimum.'
                ];
            } 

            if (!empty($body['login_email']) && !filter_var($body['login_email'], FILTER_VALIDATE_EMAIL)) {
                return [
                    'status' => 400,
                    'msg' => 'The request body email is not valid.'
                ];
            }
            return false;
        }

        // Used for checking input_invalid_characters

        static private function invalid_characters_found($input) {
            return strpos($input, ' ') !== false || strpos($input, '"') !== false || strpos($input, "'") !== false;
        }

        // Check for invalid characters

        static public function input_invalid_characters($data) {

            $invalid_characters = false;

            if (is_string($data)) {
                if (self::invalid_characters_found($data)) {
                    $invalid_characters = true;
                }
            } else if (is_array($data)) {
                foreach ($data as $key => $value) {
                    if (is_array($value)) {
                        if (self::input_invalid_characters($value)) {
                            $invalid_characters = true;
                        }
                    } elseif (is_string($value)) {
                        if (self::invalid_characters_found($value)) {
                            $invalid_characters = true;
                        }
                    }
                }
            }

            if ($invalid_characters) {
                return [
                    'status' => 400,
                    'msg' => 'Inputs cannot have space or quote characters.'
                ];
            } else return false;
        }

        // Check if emails match

        static public function emails_match($a, $b) {
            return strtolower($a) === strtolower($b);
        }

        // Hash Password for POST and PUT Requests

        static public function hash_password($password = null) {
            if ($password) {

                $options = [
                    'cost' => 13
                ];

                return password_hash($password, PASSWORD_BCRYPT, $options);
            }
        }

        // Get Date Time

        static public function get_date_time() {
            return date("Y-m-d H:i:s");
        }

        // Parse user keys

        static public function parse_user_keys($user) {

            $user['id'] = intval($user['id']);
            $user['times_logged_in'] = intval($user['times_logged_in']);
            unset($user['password']);
            return $user;
        }

        // Generate token

        static public function generate_token($user) {
            Token::generate_set_cookie([
                'name' => $_ENV['WEB_TOKEN_NAME'],
                'id' => $user['id'],
                'role' => $_ENV['WEB_TOKEN_NAME'],
                'expiration' => time() + (intval($_ENV['WEB_TOKEN_EXPIRATION_DAYS']) * 86400),
                'secure' => true,
                'http_only' => true
            ]);
        }

        // Authorized User

        static public function authorized_user($data) {

            // Make sure user has valid token

            return Token::cookie_valid($_COOKIE[$_ENV['WEB_TOKEN_NAME']], $data, $_ENV['WEB_TOKEN_NAME'], 'id') ?? false;
        }

        // Get Token Id

        static public function token_id() {
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