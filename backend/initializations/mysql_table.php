<?php 

    // Setup database connection, along with creating database schema and table in MySql if it does not already exist.

    $database = new MySql_Table($_ENV['DB_HOST'], $_ENV['DB_USERNAME'], $_ENV['DB_PASSWORD'], "link_sharing_app", "users", [
        "id mediumint(11) NOT NULL AUTO_INCREMENT",
        "first_name varchar(100)",
        "last_name varchar(100)",
        "email varchar(100) NOT NULL",
        "password varchar(100) NOT NULL",
        "image_url varchar(255)",
        "links TEXT",
        "times_logged_in mediumint(11) NOT NULL default 0",
        "last_login datetime",
        "created datetime",
        "updated datetime",
        "PRIMARY KEY (id)"
    ]);

    define("DATABASE", $database);