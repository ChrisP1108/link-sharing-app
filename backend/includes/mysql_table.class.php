<?php

class MySql_Table {
    private $db_host;
    private $db_username;
    private $db_password;
    private $schema_name;
    private $table_name;
    private $table_schema;
    private $conn;

    // Connect To Database.  Use After Database Schema Created First. Returns Boolean

    private function connect() {
        $this->conn = new mysqli($this->db_host, $this->db_username, $this->db_password, $this->schema_name);
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
        $this->conn = new mysqli($this->db_host, $this->db_username, $this->db_password);
        if (!$this->conn->connect_error) {
            $db_search_query =  "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME='". $this->schema_name ."'";
            $result = $this->conn->query($db_search_query);

            if ($result->num_rows > 0) {
                return false;
            } else {
                $db_create_query = "CREATE DATABASE " . $this->schema_name . "";
                if ($this->conn->query($db_create_query) === TRUE) {
                    $this->close_connection();
                    return true;
                } else die("Error creating database schema " . $this->schema_name);
            }
        } else return false;
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
        } else return false;
    }

    // Get data from database table.  If no id found, it will return the entire table, otherwise it will return table row based upon id. Returns false if data is unable to be retrieved

    public function get_table_data($id = null) {

        if ($this->connect()) {
            $id = intval($id);
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
            $placeholders = implode(", ", array_fill(0, count($data), "?"));
    
            $insert_query = "INSERT INTO " . $this->schema_name . "." . $this->table_name . " (" . $data_columns . ") VALUES (" . $placeholders . ")";
    
            $stmt = $this->conn->prepare($insert_query);
    
            if ($stmt) {
                $types = str_repeat("s", count($data));
                $stmt->bind_param($types, ...array_values($data));
    
                if ($stmt->execute()) {
                    $stmt->close();
                    $this->close_connection();
                    return true;
                } else {
                    $stmt->close();
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // Edit row from database table.  Returns false if failed

    public function update_table_row($id, $data) {
        $id = intval($id);
        if ($this->connect()) {
            $update_values = [];
            $placeholders = [];
    
            foreach ($data as $key => $value) {
                $update_values[] = $key . " = ?";
                $placeholders[] = $value;
            }
    
            // Build the prepared statement
            $update_query = "UPDATE " . $this->schema_name . "." . $this->table_name . " SET " . implode(", ", $update_values) . " WHERE id = ". $id. "";
    
            // Prepare the statement
            $stmt = $this->conn->prepare($update_query);
    
            if ($stmt) {
                $types = str_repeat("s", count($data));
                $stmt->bind_param($types, ...array_values($data));
    
                if ($stmt->execute()) {
                    $stmt->close();
                    $this->close_connection();
                    return true;
                } else {
                    $stmt->close();
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // Delete row from database table.  Returns false if failed

    public function delete_table_row($id) {
        $id = intval($id);
        if ($this->connect()) {
            $delete_query = "DELETE FROM " . $this->schema_name . "." . $this->table_name . " WHERE id = " . $id . "";
            if ($this->conn->query($delete_query) === TRUE) {
                $this->close_connection();
                return true;
            } else return false;
        } else return false;
    }

    // Run On Instantiation

    public function __construct($db_host = null, $db_username = null, $db_password = null, $schema_name = null, $table_name = null, $table_schema = null) {
        
        // Set properties 
        
        $this->db_host = $db_host;
        $this->db_username = $db_username;
        $this->db_password = $db_password;
        $this->schema_name = $schema_name;
        $this->table_name = $table_name;
        $this->table_schema = $table_schema;

        // Make sure database schema and database table are created if not already

        $this->create_db_schema_if_none();

        $this->create_db_table_if_none();
    }
}