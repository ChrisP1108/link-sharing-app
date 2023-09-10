<?php

class Db_Connection {
    private $conn;
    private $schema_name;
    private $table_name;
    private $table_schema;

    // Connect To Database.  Use After Database Schema Created First. Returns Boolean

    private function connect() {
        $this->conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USERNAME'], $_ENV['DB_PASSWORD'], $this->schema_name);
        if ($this->conn->connect_error) {
            return false;
        } else return true;
    }

    // Close Database Connection.  Check That Connection Was Made.  Returns Boolean

    public function close_connection() {
        if ($this->conn && !$this->conn->connect_error) {
            $this->conn->close();
            return true;
        } else return false;
    }

    // Check For Database Scheme.  Returns Boolean.  Throws Error If Connection Fails

    private function create_db_schema_if_none() {
        $this->conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USERNAME'], $_ENV['DB_PASSWORD']);
        if (!$this->conn->connect_error) {
            $db_search_query =  "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME='". $this->schema_name ."'";
            $result = $this->conn->query($db_search_query);

            if ($result->num_rows > 0) {
                return false;
            } else {
                $db_create_query = "CREATE DATABASE " . $this->schema_name . "";
                if ($this->conn->query($db_create_query) === TRUE) {
                    return true;
                    $this->close_connection();
                } else die("Error creating database schema " . $this->schema_name);
            }
        } else die("Error connecting to database when attempting to check database for existing database schema.");
    }

    // Check For Database Table In Specified Database Schema.  Returns Boolean.  Throws Error If Connection Fails

    private function create_db_table_if_none() {
        if ($this->connect()) {
            $table_search_query =  "SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '". $this->schema_name ."' AND TABLE_NAME = '" . $this->table_name ."'";
            $result = $this->conn->query($table_search_query);

            if ($result->num_rows > 0) {
                return false;
            } else {
                $table_create_query = "CREATE TABLE " . $this->table_name . " (
                    " . implode(', ', $this->table_schema) ."
                )";

                if ($this->conn->query($table_create_query) === TRUE) {
                    $this->close_connection();
                    return true;
                } else die("Error creating database table " . $this->table_name . " in " . $this->schema_name . " database schema.");
            }
        } else die("Error connecting to database when attempting to check database for existing database table in a database schema.");
    }

    // Get data from database table.  If no id found, it will return the entire table, otherwise it will return table row based upon id. Returns false if data is unable to be retrieved

    public function get_table_data($id = null) {
        if ($this->connect()) {
            $select_query = null;
            if ($id) {
                $select_query = "SELECT * FROM " . $this->schema_name . "." . $this->table_name . " WHERE id = " . $id . "";
            } else {
                $select_query = "SELECT * FROM " . $this->schema_name . "." . $this->table_name . ";";
            }
            $result = $this->conn->query($select_query);
            if ($result) {
                $output = [];
                if (!$id && $result-> num_rows > 0) {
                    while($row = $result->fetch_assoc()) {
                        array_push($output, $row);
                    }
                } else $output = $result->fetch_assoc();
                $this->close_connection();
                return $output;
            } else return false;
        } else return false;
    }

    // Create row from database table.  Returns false if failed

    public function create_table_row($data) {
        if ($this->connect()) {
            $data_columns = implode(", ", array_keys($data));
            $data_values = "'" . implode("', '", array_values($data)) . "'";
            $insert_query = "INSERT INTO " . $this->schema_name . "." . $this->table_name . " (" . $data_columns . ") VALUES (" . $data_values . ")";
            if ($this->conn->query($insert_query) === TRUE) {
                $this->close_connection();
                return true;
            } else return false;
        } else return false;
    }

    // Edit row from database table.  Returns false if failed

    public function update_table_row($id, $data) {
        if ($this->connect()) {
            $update_values = [];
            foreach(array_keys($data) as $index => $key) {
                array_push($update_values, $key . " = " .  "'" . array_values($data)[$index] . "'");
            }
            $update_query = "UPDATE " . $this->schema_name . "." . $this->table_name . " SET " . implode(", ", $update_values) . " WHERE id = " . $id . "";
            if ($this->conn->query($update_query) === TRUE) {
                $this->close_connection();
                return true;
            } else return false;
        } else return false;
    }

    // Delete row from database table.  Returns false if failed

    public function delete_table_row($id) {
        if ($this->connect()) {
            $delete_query = "DELETE FROM " . $this->schema_name . "." . $this->table_name . " WHERE id = " . $id . "";
            if ($this->conn->query($delete_query) === TRUE) {
                $this->close_connection();
                return true;
            } else return false;
        } else return false;
    }

    // Run On Instantiation

    public function __construct($schema_name, $table_name, $table_schema) {
        $this->schema_name = $schema_name;
        $this->table_name = $table_name;
        $this->table_schema = $table_schema;

        // Make sure database schema and database table are created if not already

        $this->create_db_schema_if_none();

        $this->create_db_table_if_none();
    }
}