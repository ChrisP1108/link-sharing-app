<?php

    class View {
        private $file_path;
        private $redirect_to_404;
        private $redirect_404_view;

        // Create view route.  Run 404 page if redirect_to_404 set to true

        public function create($routes) {
            $route_found = false;
            foreach($routes as $route) {
                if ($_SERVER['REQUEST_URI'] === $route['route']) {
                    $route_found = true;
                    include $this->file_path . '/' . $route['view'] . '.php';
                }
            }
                
            if ($this->redirect_to_404 && $this->redirect_404_view && !$route_found) {
                include $this->file_path . '/' . $this->redirect_404_view . '.php';
            }
        }

        // Run on instantiation

        public function __construct($file_path = '', $redirect_to_404 = false, $redirect_404_view = null) {
            $this->file_path = $file_path;
            $this->redirect_to_404 = $redirect_to_404;
            $this->redirect_404_view = $redirect_404_view;
        }
    }