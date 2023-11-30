<?php 

    // GET ROOT DIRECTORY

        function get_full_path($local_path = '') {
            return $_SERVER['DOCUMENT_ROOT'] . '/' . $local_path;
        }

    // BACKEND IMPORTS

        // Class Imports

        require get_full_path('backend/includes/env.class.php');
        require get_full_path('backend/includes/mysql_table.class.php');
        require get_full_path('backend/includes/api.class.php');
        require get_full_path('backend/includes/token.class.php');
        require get_full_path('backend/includes/sanitize.class.php');
        

        // Initialization Imports

        require get_full_path('backend/initializations/env.php');
        require get_full_path('backend/initializations/mysql_table.php');
        require get_full_path('backend/initializations/api_controllers/utilities.class.php');
        require get_full_path('backend/initializations/api_controllers/delete.php');
        require get_full_path('backend/initializations/api_controllers/get.php');
        require get_full_path('backend/initializations/api_controllers/post.php');
        require get_full_path('backend/initializations/api_controllers/put.php');

    // FRONTEND IMPORTS

        // Class Imports

        require get_full_path('frontend/includes/view.class.php');

        // Utilities

        require get_full_path('frontend/utilities/get_user_data.php');
        require get_full_path('frontend/utilities/user_page_authenticate.php');
        require get_full_path('frontend/utilities/components.php');
        require get_full_path('frontend/utilities/link_options_data.php');
        require get_full_path('frontend/utilities/get_url_origin.php');

        // Views Controller Import

        require get_full_path('frontend/initializations/views.php');