<?php

    class Component {

        private static function get_path($component) {
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

        public static function create_edit() {
            self::get_path('create_edit');
        }
    }