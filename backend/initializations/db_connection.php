<?php 

    // Setup database connection

    global $database;

    $database = new Db_Connection("link_sharing_app", "users", [
        "id mediumint(11) NOT NULL AUTO_INCREMENT",
        "first_name varchar(100) NOT NULL",
        "last_name varchar(100) NOT NULL",
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