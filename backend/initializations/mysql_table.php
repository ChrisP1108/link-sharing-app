<?php 

    // Setup database connection, along with creating database schema and table in MySql if it does not already exist.

    try {
        $database = new MySql_Table($_ENV['DB_HOST'], $_ENV['DB_USERNAME'], $_ENV['DB_PASSWORD'], $_ENV['DB_SCHEMA_NAME'], $_ENV['DB_TABLE_NAME'], [
            "id mediumint(11) NOT NULL AUTO_INCREMENT",
            "first_name varchar(100)",
            "last_name varchar(100)",
            "login_email varchar(100)",
            "display_email varchar(100)",
            "password varchar(100) NOT NULL",
            "image_url varchar(255)",
            "links TEXT",
            "times_logged_in mediumint(11) NOT NULL default 1",
            "last_login datetime",
            "created datetime",
            "updated datetime",
            "PRIMARY KEY (id)"
        ]);

        define("DATABASE", $database);

    // If error occurs, output error message to page

    } catch(Exception $e) {
        echo '
            <script>
                window.addEventListener("load", () => {
                    document.body.outerHTML = `<body style="min-height: 100vh; display: flex; margin: 0; padding: 100px max(4%, 20px); box-sizing: border-box; background: #FAFAFA; color: #333333; font-family: Arial;"><h1 style="margin: auto; text-align: center; font-size: min(2rem, 8vw); overflow: hidden;">Error connecting to the database.<h1></body>`;
                });
            </script>
        ';

        die();
    }