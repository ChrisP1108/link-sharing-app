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
        require 'backend/initializations/api.php';

    // FRONTEND IMPORTS

        // Class Imports

        require 'frontend/includes/view.class.php';

        // User Page Authentication Utilities

        require 'frontend/includes/user_page_authenticate.function.php';

        // Views Controller Import

        require 'frontend/initializations/views.php';

