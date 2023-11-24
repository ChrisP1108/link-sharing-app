<?php 
    function get_url_origin() {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        $port = $_SERVER['SERVER_PORT'] == '80' ? '' : ':' . $_SERVER['SERVER_PORT'];
        $origin = $protocol . '://' . $_SERVER['HTTP_HOST'];
        return $origin;
    }