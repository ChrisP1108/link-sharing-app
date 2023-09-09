<?php

class ENV {
    public static function load($filePath) {

        if (!file_exists($filePath)) {
            throw new Exception("The .env file does not exist.");
        }
    
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        if ($lines === false) {
            throw new Exception("Error reading the .env file.");
        }
    
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

// Set Environment Variables in $_ENV from the .env file

ENV::load(dirname(dirname(__DIR__)) . '\.env');