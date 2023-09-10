<?php

// Setup Environment Variables From .env

class ENV {
    public static function load($filePath) {

        // Check If .env Exists

        if (!file_exists($filePath)) {
            throw new Exception("The .env file does not exist.");
        }

        // Read .env File.  Throw Error If Problem Reading It
    
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        if ($lines === false) {
            throw new Exception("Error reading the .env file.");
        }

        // Loop Through Lines And Assign Environment Variables And Values
    
        foreach ($lines as $line) {
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
    
                // Set the environment variable in the $_ENV array
                
                $_ENV[$key] = $value;
            }
        }
    }
}