<?php

class MySql_Table
{
    private $db_host;
    private $db_username;
    private $db_password;
    private $schema_name;
    private $table_name;
    private $table_schema;
    private $conn;

    // Connect To Database.  Use After Database Schema Created First. Returns Boolean

    private function connect()
    {
        $this->conn = new mysqli($this->db_host, $this->db_username, $this->db_password, $this->schema_name);
        if ($this->conn->connect_error) {
            return false;
        } else return true;
    }

    // Close Database Connection.  Check That Connection Was Made.  Returns Boolean

    public function close_connection()
    {
        if ($this->conn && !$this->conn->connect_error) {
            $this->conn->close();
            return true;
        } else return false;
    }

    // Check For Database Scheme.  Returns Boolean.  Throws Error If Connection Fails

    private function create_db_schema_if_none()
    {
        $this->conn = new mysqli($this->db_host, $this->db_username, $this->db_password);

        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }

        $select_stmt = $this->conn->prepare("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME=?");
        if (!$select_stmt) {
            die("Prepare statement failed: " . $this->conn->error);
        }
        $select_stmt->bind_param("s", $this->schema_name);
        $select_stmt->execute();
        $select_result = $select_stmt->get_result();

        if ($select_result->num_rows > 0) {
            $select_stmt->close();
            $this->close_connection();
            return false;
        } else {
            $select_stmt->close();
            $schema_name_escaped = $this->conn->real_escape_string($this->schema_name);
            $create_query = "CREATE DATABASE `$schema_name_escaped`";
            if ($this->conn->query($create_query) === TRUE) {
                $this->close_connection();
                return true;
            } else {
                $this->close_connection();
                die("Error creating database schema " . $this->schema_name);
            }
        }
    }

    // Check For Database Table In Specified Database Schema.  Returns Boolean.  Throws Error If Connection Fails

    private function create_db_table_if_none()
    {
        if ($this->connect()) {

            $table_search_query = "SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?";
            $select_stmt = $this->conn->prepare($table_search_query);
            if (!$select_stmt) {
                $this->close_connection();
                die("Prepare statement failed: " . $this->conn->error);
            }

            $select_stmt->bind_param("ss", $this->schema_name, $this->table_name);
            $select_stmt->execute();
            $select_result = $select_stmt->get_result();

            if ($select_result->num_rows > 0) {
                $select_stmt->close();
                $this->close_connection();
                return false;
            } else {
                $select_stmt->close();

                $table_name_escaped = $this->conn->real_escape_string($this->table_name);
                $table_schema_escaped = array_map(array($this->conn, 'real_escape_string'), $this->table_schema);

                $table_schema_sql = implode(', ', $table_schema_escaped);

                $table_create_query = "CREATE TABLE `$table_name_escaped` ($table_schema_sql)";

                if ($this->conn->query($table_create_query) === TRUE) {
                    $this->close_connection();
                    return true;
                } else {
                    $this->close_connection();
                    die("Error creating database table " . $this->table_name . " in " . $this->schema_name . " database schema: " . $this->conn->error);
                }
            }
        } else {
            return false;
        }
    }

    // Get data from database table.  If no id found, it will return the entire table, otherwise it will return table row based upon id. Returns false if data is unable to be retrieved

    public function get_table_data($id = null)
    {
        if ($this->connect()) {
            $output = [];
            $table_name_escaped = $this->conn->real_escape_string($this->table_name);
            $schema_name_escaped = $this->conn->real_escape_string($this->schema_name);

            if ($id !== null) {
                $select_query = "SELECT * FROM " . $schema_name_escaped . "." . $table_name_escaped . " WHERE id = ?";
                $stmt = $this->conn->prepare($select_query);
                if (!$stmt) {
                    $this->close_connection();
                    die("Prepare statement failed: " . $this->conn->error);
                }
                $stmt->bind_param("i", $id);
                $stmt->execute();
                $result = $stmt->get_result();
                $output = $result->fetch_assoc();
                $stmt->close();
            } else {
                $select_query = "SELECT * FROM " . $schema_name_escaped . "." . $table_name_escaped;
                $result = $this->conn->query($select_query);

                if ($result && $result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        $output[] = $row;
                    }
                }
            }

            $this->close_connection();

            return $output;
        } else {
            return false;
        }
    }

    // Create row from database table.  Returns false if failed

    public function create_table_row($data)
    {
        if ($this->connect()) {
            $data_columns = implode(", ", array_keys($data));
            $placeholders = implode(", ", array_fill(0, count($data), "?"));

            $table_name_escaped = $this->conn->real_escape_string($this->table_name);
            $schema_name_escaped = $this->conn->real_escape_string($this->schema_name);

            $insert_query = "INSERT INTO " . $schema_name_escaped . "." . $table_name_escaped . " (" . $data_columns . ") VALUES (" . $placeholders . ")";

            $stmt = $this->conn->prepare($insert_query);

            if ($stmt) {
                $types = str_repeat("s", count($data));
                $stmt->bind_param($types, ...array_values($data));

                if ($stmt->execute()) {
                    $stmt->close();
                    $this->close_connection();
                    return true;
                } else {
                    error_log("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
                    $stmt->close();
                    $this->close_connection();
                    return false;
                }
            } else {
                error_log("Prepare failed: (" . $this->conn->errno . ") " . $this->conn->error);
                $this->close_connection();
                return false;
            }
        } else {
            return false;
        }
    }

    // Edit row from database table.  Returns false if failed

    public function update_table_row($id, $data)
    {
        $id = intval($id);
        if ($this->connect()) {
            $update_values = [];
            $types = '';
            $placeholders = [];

            foreach ($data as $key => $value) {
                $update_values[] = $key . " = ?";
                $types .= "s";  // Assuming all data values are strings; adjust if necessary
                $placeholders[] = $value;
            }

            // Build the prepared statement
            $update_query = "UPDATE " . $this->conn->real_escape_string($this->schema_name) . "." . $this->conn->real_escape_string($this->table_name) . " SET " . implode(", ", $update_values) . " WHERE id = ?";

            // Prepare the statement
            $stmt = $this->conn->prepare($update_query);

            if ($stmt) {
                // Add 'i' for integer type for the ID
                $types .= "i";
                $placeholders[] = $id;

                // Bind parameters dynamically
                $stmt->bind_param($types, ...$placeholders);

                if ($stmt->execute()) {
                    $stmt->close();
                    $this->close_connection();
                    return true;
                } else {
                    error_log("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
                    $stmt->close();
                    $this->close_connection();
                    return false;
                }
            } else {
                error_log("Prepare failed: (" . $this->conn->errno . ") " . $this->conn->error);
                $this->close_connection();
                return false;
            }
        } else {
            return false;
        }
    }

    // Delete row from database table.  Returns false if failed

    public function delete_table_row($id)
    {
        $id = intval($id);
        if ($this->connect()) {
            $table_name_escaped = $this->conn->real_escape_string($this->table_name);
            $schema_name_escaped = $this->conn->real_escape_string($this->schema_name);

            $delete_query = "DELETE FROM " . $schema_name_escaped . "." . $table_name_escaped . " WHERE id = ?";

            $stmt = $this->conn->prepare($delete_query);

            if ($stmt) {
                $stmt->bind_param("i", $id);

                if ($stmt->execute()) {
                    $stmt->close();
                    $this->close_connection();
                    return true;
                } else {
                    error_log("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
                    $stmt->close();
                    $this->close_connection();
                    return false;
                }
            } else {
                error_log("Prepare failed: (" . $this->conn->errno . ") " . $this->conn->error);
                $this->close_connection();
                return false;
            }
        } else {
            return false;
        }
    }

    // Run On Instantiation

    public function __construct($db_host = null, $db_username = null, $db_password = null, $schema_name = null, $table_name = null, $table_schema = null)
    {

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
