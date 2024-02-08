<?php

    // @desc    Update user data
    // @route   PUT /api/user
    // @access  User and Admin

    API::put('user', function($req) {

        // Check that token exists

        if (!Controller_Utilities::token_exists()) {
            return Controller_Utilities::unauthorized_no_token();
        }

        $user = DATABASE->get_table_data(Controller_Utilities::token_id());

        if ($user !== false && !empty($user)) {

            // Check authentication.  Return 500 error if unable to get all users or 401 if token is invalid

            $all_users = DATABASE->get_table_data();

            if ($all_users !== false && !empty($all_users)) {
                if (!Controller_Utilities::authorized_user($all_users)) {
                    return Controller_Utilities::unauthorized_bad_token();
                }
            } else {
                return Controller_Utilities::error_authentication();
            }
        }

        // Get body data

        $body = $req['body'] ?? null;

        if (!$body) {
            return [
                'status' => 400,
                'msg' => 'No data in body found.'
            ];
        }

        // Check that inputs don't have invalid characters

        if (Controller_Utilities::input_invalid_characters($body) !== false) {
            return Controller_Utilities::input_invalid_characters($body);
        }

        // Handle image file upload if image upload found.  Makes sure file format is actually jpg, jpeg, or webp

        if (isset($body['image_upload'])) {
            $image_upload = [
                'data' => preg_replace('/^data:image\/\w+;base64,/', '', $body['image_upload']['data']),
                'format' => strtolower($body['image_upload']['type']),
                'size' => intval($body['image_upload']['size']),
                'width' => intval($body['image_upload']['width']),
                'height' => intval($body['image_upload']['height']),
            ];

            // Remove image upload from bodyso it is not stored in mySql

            unset($body['image_upload']);

            $allowed_extensions = array("jpeg", "jpg", "webp", "png");

            // Check if file extension is allowed type

            if (in_array($image_upload['format'], $allowed_extensions)) {

                // Throw error if file size is larger than 750KB

                if ($image_upload['size'] > 750000) {
                    return [
                        'status' => 400,
                        'msg' => 'Uploaded images must be 750KB in size or less.'
                    ];
                }

                // Throw error if width or height is greater than 1024px

                $max_pixels = intval($_ENV['IMAGE_MAX_PIXELS']);

                if ($image_upload['width'] > $max_pixels || $image_upload['height'] > $max_pixels) {
                    return [
                        'status' => 400,
                        'msg' => 'Uploaded images cannot be larger than 1024px in width or height.'
                    ];
                }

                // Delete any existing user image files on user_uploaded_images folder

                if (isset($user['image_url'])) {
                    $existing_file_path = $_ENV['IMAGE_DIRECTORY'] . explode("/user_uploaded_images", $user['image_url'])[1];
                    unlink($existing_file_path);
                }

                // Set image file name based upon user id

                $file_name = 'user_' . $user['id'];

                // Write file to directory

                $upload_path = $_ENV['IMAGE_DIRECTORY'] . '/' . $file_name . '.' . $image_upload['format'];

                file_put_contents($upload_path, base64_decode($image_upload['data']));

                // Get image uploaded url to store in MySql

                $body['image_url'] = '/' . $upload_path;

            } else {

                // Return 400 status to indicate that improper file type was uploaded

                return [
                    'status' => 400,
                    'msg' => 'An image upload must be in either jpg, jpeg, webp, or png format.'
                ];
            }
        }

        // Check that display email is valid

        if (!filter_var($body['display_email'], FILTER_VALIDATE_EMAIL)) {
            return [
                'status' => 400,
                'msg' => 'Email display field is not a valid email type'
            ];
        }

        // Check links data that it contains valid link options inputs and convert links to JSON if links are valid

        if (isset($body['links'])) {
            $invalid_link_input = false;
            try {
                foreach($body['links'] as $link) {
                    $match_found = false;
                    foreach(LINK_OPTIONS as $l) {
                        if (strtolower($link['platform']) === strtolower($l['name']) 
                            && strpos(strtolower($link['link']), strtolower($l['required_text'])) !== false 
                            && isset($link['platform']) && isset($link['link']) && isset($link['order'])) {
                            $match_found = true;
                        }
                    }
                    if (!$match_found) {
                        $invalid_link_input = true;
                        break;
                    }
                }
            } catch (Exception $e) {
                $invalid_link_input = true;
            }
            if ($invalid_link_input) {
                return [
                    'status' => 400,
                    'msg' => 'Invalid link data provided.'
                ];
            }

            $body['links'] = json_encode($body['links']);
        }

        // Remove id from body since user id already exists in database

        unset($body['id']);

        // Sanitize inputs

        $parsed_data = $body;

        // Hash password if password is being updated

        if (isset($body['password'])) {
            $parsed_data['password'] = Controller_Utilities::hash_password($body['password']);
        }

        // Set updated time stamp

        $parsed_data['updated'] = Controller_Utilities::get_date_time();

        // Update user data in MySql

        $update_user = DATABASE->update_table_row($user['id'], $parsed_data);

        if ($update_user !== false) {

            // Return 200 status if user data successfully updated

            return [
                'status' => 200,
                'msg' => 'User successfully updated.',
                'data' => ['image_url' => $body['image_url'] ? $body['image_url'] : $user['image_url']]
            ];
        } else {

            // Return 500 status if error occured updating user

            return [
                'status' => 500,
                'msg' => 'There was an error updating user.  Please try again.'
            ];
        }
    });