<?php 

    // REST API

    // @desc    Get All Users
    // @route   GET /api/users
    // @access  Admin Only

    API::get('users', function($req) {

        global $database;

        $users = $database->get_table_data();

        if ($users !== false && !empty($users)) {
            return [
                'status' => 200,
                'data' => $users,
                'msg' => 'All users retrieved successfully.'
            ];
        } 
        if ($users !== false && empty($users)) {
            return [
                'status' => 200,
                'data' => [],
                'msg' => 'No users found in table.'
            ];
        }
    });


    // @desc    Get User By Id
    // @route   GET /api/users/{id}
    // @access  User and Admin

    API::get('users/{id}', function($req) {

        global $database;

        $user = $database->get_table_data($req['id']);

        if ($user !== false && !empty($user)) {
            return [
                'status' => 200,
                'data' => $user,
                'msg' => 'User with id of '. $req['id'] .' retrieved successfully.'
            ];
        } 

        if ($user !== false && empty($user)) {
            return [
                'status' => 400,
                'msg' => 'No user with the corresponding id of ' . $req['id'] . ' found.'
            ];
        }
    });

    // @desc    Add user data
    // @route   POST /api/users
    // @access  User and Admin

    API::post('users', function($req) {

        global $database;

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

        $body['password'] = hash_password($body['password']);

        $body['created'] = get_date_time();

        $user_add = $database->create_table_row($body);

        if ($user_add !== false) {
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

    API::put('users/{id}', function($req) {

        global $database;

        $body = $req['body'] ?? null;

        if (input_invalid($body) !== false) {
            return input_invalid($body);
        }

        $id = $req['id'] ?? null;

        if (!$id) {
            return [
                'status' => 400,
                'msg' => 'A request id must be passed in along with a body when updating a table row.'
            ];
        }

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

    API::delete('users/{id}', function($req) {

        global $database;

        $id = $req['id'] ?? null;

        if (!$id) {
            return [
                'status' => 400,
                'msg' => 'A request id must be passed in to delete a table row.'
            ];
        }

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