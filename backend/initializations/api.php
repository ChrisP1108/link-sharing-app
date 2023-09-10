<?php 

    // API CONTROLLERS

    // @desc    Get User Based Upon id In cookie
    // @route   GET /api/user
    // @access  User

    API::get('user', function($req) {

        // Check that token exists

        if (!token_exists()) {
            return unauthorized_no_token();
        }

        global $database;

        $user = $database->get_table_data(token_id());

        // Check that token is valid and get data corresponding to user id

        if ($user !== false && !empty($user)) {

            // Check authentication.  Return 500 error if unable to get all users

            $all_users =  $database->get_table_data();

            if ($all_users !== false && !empty($all_users)) {
                if (!authorized_user($all_users)) {
                    return  unauthorized_bad_token();
                }
            } else {
                return error_authentication();
            }

            // Set user id key to int, times_logged_in to in, and remove password key

            $parsed_data = parse_user_keys($user);

            return [
                'status' => 200,
                'data' => $parsed_data,
                'msg' => 'User retrieved successfully.'
            ];
        } 

        // Return 400 status code if no user found

        if ($user !== false && empty($user)) {
            return [
                'status' => 400,
                'msg' => 'User not found.'
            ];
        }
    });

    // @desc    Add user data
    // @route   POST /api/users
    // @access  Public

    API::post('user', function($req) {

        global $database;

        // Check that body contains required fields

        $body = $req['body'] ?? null;

        if (input_invalid($body) !== false) {
            return input_invalid($body);
        }

        if (!$body || empty($body['first_name']) || empty($body['last_name']) || empty($body['email']) || empty($body['password'])) {
            return [
                'status' => 400,
                'msg' => 'A request body must be passed in with a first_name, last_name, email, and password keys and values at a minimum.'
            ];
        }

        // Make sure user with the same email doesn't already exist in database

        $existing_users = $database->get_table_data();

        if ($existing_users) {

            foreach($existing_users as $u) {
                if (strtolower($u['email']) === strtolower($body['email'])) {
                    return [
                        'status' => 400,
                        'msg' => 'User with the same email already exists.'
                    ];
                }
            }

        }

        $body['password'] = hash_password($body['password']);

        $body['created'] = get_date_time();

        $user_add = $database->create_table_row($body);

        if ($user_add !== false) {

            // Get new user data from database.  Check that it was added

            $updated_users = $database->get_table_data();

            $new_user = null;

            foreach($updated_users as $u) {
                if (strtolower($u['email']) === strtolower($body['email'])) {
                    $new_user = $u;
                }
            }

            if (!$new_user) {
                return [
                    'status' => 500,
                    'msg' => 'There was an error adding user.'
                ];
            }

            // Set token to be stored as HTTP only cookie.

            generate_token($new_user);

            return [
                'status' => 200,
                'msg' => 'User successfully added.'
            ];
        } else {
            return [
                'status' => 500,
                'msg' => 'There was an error adding user.'
            ];
        }
    });

    // @desc    Update user data by id
    // @route   PUT /api/users/{id}
    // @access  User and Admin

    API::put('user', function($req) {

        // Check that token exists

        if (!token_exists()) {
            return unauthorized_no_token();
        }

        global $database;

        $user = $database->get_table_data(token_id());

        if ($user !== false && !empty($user)) {

            // Check authentication.  Return 500 error if unable to get all users

            $all_users =  $database->get_table_data();

            if ($all_users !== false && !empty($all_users)) {
                if (!authorized_user($all_users)) {
                    return  unauthorized_bad_token();
                }
            } else {
                return error_authentication();
            }
        }

        $body = $req['body'] ?? null;

        if (input_invalid($body) !== false) {
            return input_invalid($body);
        }

        $id = token_id() ?? null;

        if (!empty($body['password'])) {
            $body['password'] = hash_password($body['password']);
        }

        $body['updated'] = get_date_time();

        $update_user = $database->update_table_row($id, $body);

        if ($update_user !== false) {
            return [
                'status' => 200,
                'msg' => 'User successfully updated.'
            ];
        } else {
            return [
                'status' => 500,
                'msg' => 'There was an error updating user.'
            ];
        }
    });

    // @desc    Delete user by id
    // @route   DELETE /api/users/{id}
    // @access  User and Admin

    API::delete('user', function($req) {

        // Check that token exists

        if (!token_exists()) {
            return unauthorized_no_token();
        }

        global $database;

        $user = $database->get_table_data(token_id());

        if ($user !== false && !empty($user)) {
            
            // Check authentication.  Return 500 error if unable to get all users

            $all_users =  $database->get_table_data();

            if ($all_users !== false && !empty($all_users)) {
                if (!authorized_user($all_users)) {
                    return  unauthorized_bad_token();
                }
            } else {
                return error_authentication();
            }
        }

        $id = token_id() ?? null;

        $delete_user = $database->delete_table_row($id);

        if ($delete_user !== false) {
            return [
                'status' => 200,
                'msg' => 'User successfully deleted.'
            ];
        } else {
            return [
                'status' => 500,
                'msg' => 'There was an error deleting user.'
            ];
        }

    });

    // @desc    User login
    // @route   POST /api/user/login
    // @access  Public

    API::post('user/login', function($req) {

        // Check that email and password was passed into the body.  Return 400 status if not.

        $body = $req['body'] ?? null;

        if (!$body || empty($body['email']) || empty($body['password'])) {
            return [
                'status' => 400,
                'msg' => 'A request body must be passed in with an email and password keys to login.'
            ];
        }

        global $database;

        $all_users =  $database->get_table_data();

        // Find user in database matching email and check password.

        $authorized = false;

        $user = null;

        if ($all_users !== false && !empty($all_users)) {

            foreach($all_users as $u) {
                if (strtolower($body['email']) === strtolower($u['email'])) {
                    $user = $u;
                }
            }

            if ($user) {
                $authorized = password_verify($body['password'], $u['password']);
            }
        } 

        // If credentials failed, return 401 status, otherwise set token and return 200 status
        
        if (!$authorized) {
            return [
                'status' => 401,
                'msg' => 'Invalid credentials.'
            ];
        } else {
            generate_token($user);
            return [
                'status' => 200,
                'msg' => 'User successfully logged in.'
            ];
        }

    });

    // @desc    User logout
    // @route   POST /api/user/logout
    // @access  Public

    API::post('user/logout', function($req) {

        if (token_exists()) {
            Token::remove_cookie($_ENV['WEB_TOKEN_NAME']);
            return [
                'status' => 200,
                'msg' => 'User successfully logged out.'
            ];
        } else {
            return [
                'status' => 400,
                'msg' => 'User already logged out.'
            ];
        }

    });

    
    // UTILITY FUNCTIONS

    // Handle body input error on POST and PUT Requests

    function input_invalid($body) {
        if (!$body || empty($body['first_name']) || empty($body['last_name']) || empty($body['email']) || empty($body['password'])) {
            return [
                'status' => 400,
                'msg' => 'A request body must be passed in with a first_name, last_name, email, and password keys and values at a minimum.'
            ];
        } 

        return false;
    }

    // Hash Password for POST and PUT Requests

    function hash_password($password = null) {
        if ($password) {

            $options = [
                'cost' => 13
            ];

            return password_hash($password, PASSWORD_BCRYPT, $options);
        }
    }

    // Get Date Time

    function get_date_time() {
        return date("Y-m-d H:i:s");
    }

    // Parse user keys

    function parse_user_keys($user) {
        $user['id'] = intval($user['id']);
        $user['times_logged_in'] = intval($user['times_logged_in']);
        unset($user['password']);
        return $user;
    }

    // Generate token

    function generate_token($user) {
        Token::generate_set_cookie([
            'name' => $_ENV['WEB_TOKEN_NAME'],
            'id' => $user['id'],
            'role' => $_ENV['WEB_TOKEN_NAME'],
            'expiration' => time() + 604800,
            'secure' => false,
            'http_only' => true
        ]);
    }

    // Authorized User

    function authorized_user($data) {

        // Make sure user has valid token

        return Token::cookie_valid($_COOKIE[$_ENV['WEB_TOKEN_NAME']], $data, $_ENV['WEB_TOKEN_NAME'], 'id') ?? false;
    }

    // Get Token Id

    function token_id() {
        $cookie = $_COOKIE[$_ENV['WEB_TOKEN_NAME']] ?? null;
        return Token::get_cookie_id($cookie);
    }

    // Check if token exists

    function token_exists() {
        $cookie = $_COOKIE[$_ENV['WEB_TOKEN_NAME']] ?? false;
        if (!$cookie) {
            return false;
        } else return true;
    }

    // Unauthorized message

    function  unauthorized_bad_token() {
        Token::remove_cookie($_ENV['WEB_TOKEN_NAME']);
        return [
            'status' => 401,
            'msg' => 'Unauthorized. Invalid token.'
        ];
    }

    // No token, unauthorized message

    function unauthorized_no_token() {
        return [
            'status' => 401,
            'msg' => 'Unauthorized. No token.'
        ];
    }

    // Error getting user data during authentication

    function error_authentication() {
        return [
            'status' => 500,
            'msg' => 'Error getting user data during authentication.'
        ];
    }


