<?php

    // @desc    Delete user by id
    // @route   DELETE /api/users/{id}
    // @access  User and Admin

    API::delete('user', function($req) {

        // Check that token exists

        if (!Controller_Utilities::token_exists()) {
            return Controller_Utilities::unauthorized_no_token();
        }

        $user = DATABASE->get_table_data(Controller_Utilities::token_id());

        if ($user !== false && !empty($user)) {
            
            // Check authentication.  Return 500 error if unable to get all users or 401 if token is invalid.

            $all_users =  DATABASE->get_table_data();

            if ($all_users !== false && !empty($all_users)) {
                if (!Controller_Utilities::authorized_user($all_users)) {
                    return  Controller_Utilities::unauthorized_bad_token();
                }
            } else {
                return Controller_Utilities::error_authentication();
            }
        }

        $id = Controller_Utilities::token_id() ?? null;

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