<?php

    // @desc    Add user data
    // @route   POST /api/user
    // @access  Public

    API::post('user', function($req) {

        // Check that body contains required fields

        $body = $req['body'] ?? null;

        // Return 400 status if body data does not have required fields

        if (Controller_Utilities::input_invalid($body) !== false) {
            return Controller_Utilities::input_invalid($body);
        }

        // Make sure user with the same email doesn't already exist in database

        $existing_users = DATABASE->get_table_data();

        if ($existing_users) {

            foreach($existing_users as $u) {
                if (Controller_Utilities::emails_match($u['login_email'], $body['login_email'])) {
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

        $sanitized_data['password'] = Controller_Utilities::hash_password($body['password']);

        // Timestamp date created

        $sanitized_data['created'] = Controller_Utilities::get_date_time();

        // Timestamp date last login

        $sanitized_data['last_login'] = Controller_Utilities::get_date_time();

        // Add user to database

        $user_add = DATABASE->create_table_row($sanitized_data);

        // Check that user was added

        if ($user_add !== false) {

            // Get new user data from database.  Check that it was added

            $updated_users = DATABASE->get_table_data();

            $new_user = null;

            foreach($updated_users as $u) {
                if (Controller_Utilities::emails_match($u['login_email'], $sanitized_data['login_email'])) {
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

            Controller_Utilities::generate_token($new_user);

            // Return 201 status if user successfully added.

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

    // @desc    User login
    // @route   POST /api/user/login
    // @access  Public

    API::post('user/login', function($req) {

        // Check that email and password was passed into the body.  Return 400 status if not.

        $body = $req['body'] ?? null;

        // Return 400 status if body data does not have required fields

        if (Controller_Utilities::input_invalid($body) !== false) {
            return Controller_Utilities::input_invalid($body);
        }

        $all_users =  DATABASE->get_table_data();

        // Find user in database matching email and check password.

        $authorized = false;

        $user = null;

        if ($all_users !== false && !empty($all_users)) {

            // Find corresponding user in database that matches email

            foreach($all_users as $u) {
                if (Controller_Utilities::emails_match($body['login_email'], $u['login_email'])) {
                    $user = $u;
                }
            }

            // If user in database found, check password

            if ($user) {
                $authorized = password_verify($body['password'], $user['password']);
            }
        } 

        // Return 400 response if user email not found

        if (!$user) {
            return [
                'status' => 400,
                'msg' => 'No user with email entered exists.'
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

            $update_data['times_logged_in'] = $increment_times_logged_in;

            // Timestamp date last login

            $update_data['last_login'] = Controller_Utilities::get_date_time();

            DATABASE->update_table_row($user['id'], $update_data);
            
            Controller_Utilities::generate_token($user);

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

        if (Controller_Utilities::token_exists()) {

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
