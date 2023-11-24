<?php 

    // BACKEND IMPORTS

        // Class Imports

        require 'backend/includes/env.class.php';
        require 'backend/includes/mysql_table.class.php';
        require 'backend/includes/api.class.php';
        require 'backend/includes/token.class.php';
        require 'backend/includes/sanitize.class.php';
        

        // Initialization Imports

        require 'backend/initializations/env.php';
        require 'backend/initializations/mysql_table.php';
        require 'backend/initializations/api_controllers/utilities.class.php';
        require 'backend/initializations/api_controllers/delete.php';
        require 'backend/initializations/api_controllers/get.php';
        require 'backend/initializations/api_controllers/post.php';
        require 'backend/initializations/api_controllers/put.php';

    // FRONTEND IMPORTS

        // Class Imports

        require 'frontend/includes/view.class.php';

        // Utilities

        require 'frontend/utilities/get_user_data.php';
        require 'frontend/utilities/user_page_authenticate.php';
        require 'frontend/utilities/components.php';
        require 'frontend/utilities/link_options_data.php';
        require 'frontend/utilities/get_url_origin.php';

        // Views Controller Import

        require 'frontend/initializations/views.php';

