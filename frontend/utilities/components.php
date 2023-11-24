<?php

    class Component {

        // Get component based upon file path

        private static function get_path($component = '', $props = null) {
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

        public static function create_login($props = false) {
            self::get_path('create_login', $props);
        }

        // Logo

        public static function logo() {
            self::get_path('logo');
        }

        // Form Field

        public static function form_field($props = null) {
            self::get_path('form_field', $props);
        }

        // Mobile Content

        public static function mobile_content($props) {
            self::get_path("mobile_content", $props);
        }
    }