<?php

class Sanitize {

    // Take input data, sanitize and return sanitized data

    public static function sanitize_data($data) {

        // Sanitize data based on data type

        switch(gettype($data)) {
            case 'array':
                $output = [];
                foreach($data as $key => $value) {
                    $output[gettype($key) === 'string' ? htmlspecialchars($key) : $key] = gettype($value) === 'string' ? htmlspecialchars($value) : $value;
                }
                return $output;
                break;
            case 'string':
                return htmlspecialchars($data);
                break;
            default:
                return $data;
                break;
        }
        
    }
}