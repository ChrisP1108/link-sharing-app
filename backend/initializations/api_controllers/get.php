<?php

    // @desc    Get User Based Upon id In cookie
    // @route   GET /api/user
    // @access  User

    API::get('user', function($req) {

        // Check that token exists

        if (!Controller_Utilities::token_exists()) {
            return Controller_Utilities::unauthorized_no_token();
        }

        $user = DATABASE->get_table_data(Controller_Utilities::token_id());

        // Check that token is valid and get data corresponding to user id

        if ($user !== false && !empty($user)) {

            // Check authentication.  Return 500 error if unable to get all users

            $all_users = DATABASE->get_table_data();

            if ($all_users !== false && !empty($all_users)) {
                if (!Controller_Utilities::authorized_user($all_users)) {
                    return  Controller_Utilities::unauthorized_bad_token();
                }
            } else {
                return Controller_Utilities::error_authentication();
            }

            // Set user id key to int, times_logged_in to in, and remove password key

            $parsed_data = Controller_Utilities::parse_user_keys($user);

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