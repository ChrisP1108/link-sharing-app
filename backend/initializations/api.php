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

        $user = DATABASE->get_table_data(token_id());

        // Check that token is valid and get data corresponding to user id

        if ($user !== false && !empty($user)) {

            // Check authentication.  Return 500 error if unable to get all users

            $all_users = DATABASE->get_table_data();

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
    // @route   POST /api/user
    // @access  Public

    API::post('user', function($req) {

        // Check that body contains required fields

        $body = $req['body'] ?? null;

        if (input_invalid($body) !== false) {
            return input_invalid($body);
        }

        // Return 400 status if body data does not have required fields

        if (input_invalid($body) !== false) {
            return input_invalid($body);
        }

        // Make sure user with the same email doesn't already exist in database

        $existing_users = DATABASE->get_table_data();

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

        // Sanitize inputs

        $sanitized_data = Sanitize::sanitize_data($body);

        // Hash password

        $sanitized_data['password'] = hash_password($body['password']);

        // Timestamp date created

        $sanitized_data['created'] = get_date_time();

        // Add user to database

        $user_add = DATABASE->create_table_row($sanitized_data);

        // Check that user was added

        if ($user_add !== false) {

            // Get new user data from database.  Check that it was added

            $updated_users = DATABASE->get_table_data();

            $new_user = null;

            foreach($updated_users as $u) {
                if (strtolower($u['email']) === strtolower($sanitized_data['email'])) {
                    $new_user = $u;
                }
            }

            // Return 500 status if user added wasn't found in databaze

            if (!$new_user) {
                return [
                    'status' => 500,
                    'msg' => 'There was an error adding user.  Please try again.'
                ];
            }

            // Set token to be stored as HTTP only cookie.

            generate_token($new_user);

            // Return 200 status if user successfully added.

            return [
                'status' => 201,
                'msg' => 'User successfully added.'
            ];
        } else {

            // Return 500 status if error occured adding user to database

            return [
                'status' => 500,
                'msg' => 'There was an error adding user. Please try again.'
            ];
        }
    });

    // @desc    Update user data
    // @route   PUT /api/user
    // @access  User and Admin

    API::put('user', function($req) {

        // Check that token exists

        if (!token_exists()) {
            return unauthorized_no_token();
        }

        $user = DATABASE->get_table_data(token_id());

        if ($user !== false && !empty($user)) {

            // Check authentication.  Return 500 error if unable to get all users or 401 if token is invalid

            $all_users = DATABASE->get_table_data();

            if ($all_users !== false && !empty($all_users)) {
                if (!authorized_user($all_users)) {
                    return unauthorized_bad_token();
                }
            } else {
                return error_authentication();
            }
        }

        // Get body data

        $body = $req['body'] ?? null;

        // Separate image upload if found in body and assign to $image_upload

        $image_upload = null;

        if ($body['image_upload']) {
            $image_upload = $body['image_upload'];
            unset($body['image_upload']);
        }

        // Handle image file upload.  Makes sure file format is actually jpg, jpeg, or webp

        if ($image_upload) {
            $file_name = $image_upload['name'];
            $file_extension = explode(".", $file_name);
            $file_extension = strtolower(end($file_extension));
            $file_size = $image_upload['size'];

            $allowed_extensions = array("jpeg", "jpg", "webp");

            if (in_array($file_extension, $allowed_extensions)) {

                if ($file_size > 750000) {
                    return [
                        'status' => 400,
                        'msg' => 'Uploaded images must be 750KB in size or less.'
                    ];
                }

                $upload_directory = 'user_uploaded_images/' . $file_name;

                file_put_contents($upload_directory, $image_upload);

                // Get image uploaded url to store in MySql

                $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https://" : "http://";

                $domain = $_SERVER['HTTP_HOST'];

                $body['image_url'] = $protocol . $domain . $upload_directory;

            } else {

                // Return 400 status to indicate that improper file type was uploaded

                return [
                    'status' => 400,
                    'msg' => 'An image upload must be in either jpg, jpeg, or webp format.'
                ];
            }
        }

        // Get Id from token

        $id = token_id() ?? null;

        // Sanitize inputs

        $sanitized_data = Sanitize::sanitize_data($body);

        // Hash password if password is being updated

        if ($body['password']) {
            $sanitized_data['password'] = hash_password($body['password']);
        }

        // Set updated time stamp

        $sanitized_data['updated'] = get_date_time();

        // Update user data in MySql

        $update_user = DATABASE->update_table_row($id, $sanitized_data);

        if ($update_user !== false) {

            // Return 200 status if user data successfully updated

            return [
                'status' => 200,
                'msg' => 'User successfully updated.'
            ];
        } else {

            // Return 500 status if error occured updating user

            return [
                'status' => 500,
                'msg' => 'There was an error updating user.  Please try again.'
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

        $user = DATABASE->get_table_data(token_id());

        if ($user !== false && !empty($user)) {
            
            // Check authentication.  Return 500 error if unable to get all users or 401 if token is invalid.

            $all_users =  DATABASE->get_table_data();

            if ($all_users !== false && !empty($all_users)) {
                if (!authorized_user($all_users)) {
                    return  unauthorized_bad_token();
                }
            } else {
                return error_authentication();
            }
        }

        $id = token_id() ?? null;

        $delete_user = DATABASE->delete_table_row($id);

        if ($delete_user !== false) {

            // Return 200 status if user was successfully deleted.

            return [
                'status' => 200,
                'msg' => 'User successfully deleted.'
            ];
        } else {

            // Return 500 status if there was an error deleting user.

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

        $all_users =  DATABASE->get_table_data();

        // Find user in database matching email and check password.

        $authorized = false;

        $user = null;

        if ($all_users !== false && !empty($all_users)) {

            // Find corresponding user in database that matches email

            foreach($all_users as $u) {
                if (strtolower($body['email']) === strtolower($u['email'])) {
                    $user = $u;
                }
            }

            // If user in database found, check password

            if ($user) {
                $authorized = password_verify($body['password'], $u['password']);
            }
        } 

        // Return 400 response if user email not found

        if (!$user) {
            return [
                'status' => 401,
                'msg' => 'Invalid user email address.'
            ];
        }

        // If password failed, return 401 status, otherwise increment times logged in, set token and return 200 status
        
        if (!$authorized) {
            return [
                'status' => 401,
                'msg' => 'Invalid password.'
            ];
        } else {

            // Increment times user logged in

            $increment_times_logged_in = intval($user['times_logged_in']) + 1;
            DATABASE->update_table_row($user['id'], ['times_logged_in' => $increment_times_logged_in]);
            
            generate_token($user);

            // Return 200 status

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

            // If token found, remove it and return 200 status

            Token::remove_cookie($_ENV['WEB_TOKEN_NAME']);
            return [
                'status' => 200,
                'msg' => 'User successfully logged out.'
            ];
        } else {

            // If token not found, return 400 status

            return [
                'status' => 400,
                'msg' => 'User already logged out.'
            ];
        }

    });

    
    // UTILITY FUNCTIONS

    // Handle body input error on POST and PUT Requests

    function input_invalid($body) {
        if (!$body || empty($body['email']) || empty($body['password'])) {
            return [
                'status' => 400,
                'msg' => 'A request body must be passed in with an email and password keys and values at a minimum.'
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

    function unauthorized_bad_token() {
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