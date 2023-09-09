<?php

class API {

    // Starting Api Path '/api'

    private const ROOT_URI = '/api/';

    // Get route url id if present

    private static function split_url_id() {
        return preg_split('/(\d+)/', $_SERVER['REQUEST_URI'], 2, PREG_SPLIT_DELIM_CAPTURE);
    }

    // Determines is request type and route match a particular condition

    private static function is_request($type, $route) {

        // Check if there are url parameters

        $parsed_uri = '';

        if (str_contains($_SERVER['REQUEST_URI'], '?')) {
            $parsed_uri = explode('?', $_SERVER['REQUEST_URI'])[0];
        } else $parsed_uri = $_SERVER['REQUEST_URI'];

        // Check for route ids in url

        $uri_has_id = self::split_url_id();

        if ($uri_has_id[1]) {
            $parsed_uri = $uri_has_id[0];
        }

        if (str_contains($route, '/{id}')) {
            $parsed_route = self::ROOT_URI . explode('{id}', $route)[0];
        } else $parsed_route = $route;

        return $_SERVER['REQUEST_METHOD'] === $type && $parsed_uri ===  $parsed_route;
    }

    // Collects header, url parameters, and body data

    private static function parse_request_data($route) {

        // Get Header Data

        $header_data = [];

        $headers = getallheaders();

        foreach($headers as $key => $value) {
            $header_data[$key] = $value;
        }

        // Get URL parameters

        $params_data = [];

        foreach($_GET as $key => $value) {
            $params_data[$key] = $value;
        }

        // Get body data

        $request_body_data = file_get_contents('php://input');

        $parsed_body_data = json_decode($request_body_data, true);

        $body_data = [];

        if (!empty($parsed_body_data)) {

            foreach ($parsed_body_data as $key => $value) {
                $body_data[$key] = $value;
            }
        }

        $output = [
            'headers' => $header_data,
            'parameters' => $params_data,
            'body' => $body_data
        ];

        $id = self::split_url_id()[1];

        if ($id) {
            $output['id'] = $id;
        }

        return $output;
    }

    // Callback Controller And Response Handler

    private static function callback_response($callback, $route) {
        if (is_callable($callback)) {
            $response = $callback(self::parse_request_data($route));
            header('Content-Type: application/json');
            http_response_code($response['status'] ?? 200);
            echo json_encode($response);
            exit;
        }
    }

    // HTTP Get Request

    public static function get($route, $callback) {
        if (self::is_request("GET", $route)) {
            self::callback_response($callback, $route);
        }
    }

    // HTTP POST Request

    public static function post($route, $callback) {
        if (self::is_request("POST", $route)) {
            self::callback_response($callback, $route);
        }
    }

    // HTTP PUT Request

    public static function put($route, $callback) {
        if (self::is_request("PUT", $route)) {
            self::callback_response($callback, $route);
        }
    }

    // HTTP DELETE Request

    public static function delete($route, $callback) {
        if (self::is_request("DELETE", $route)) {
            self::callback_response($callback, $route);
        }
    }
}