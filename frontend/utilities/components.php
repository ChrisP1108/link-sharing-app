<?php

    class Component {

        private static function get_path($component = '', $prop = null) {
            include dirname(__DIR__) . '/components/' . $component . '.php';
        }

        // Header Component

        public static function header() {
            self::get_path('header');
        }

        // Footer Component

        public static function footer() {
            self::get_path('footer');
        }

        // Create / Edit Component

        public static function create_login($create = false) {
            self::get_path('create_login', $create);
        }

        // Logo

        public static function logo() {
            self::get_path('logo');
        }
    }