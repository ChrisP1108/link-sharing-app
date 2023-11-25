<?php

    class View {
        private $file_path;
        private $redirect_to_404;
        private $redirect_404_view;

        // Create view route.  Run 404 page if redirect_to_404 set to true

        public function create($routes = null, $permission_callback = null, $unauthorized_redirect = null) {
            $route_found = false;

            // Loop through routes and run permission_callback for authentication

            foreach($routes as $route) {

                // Check if route is for a user public share page

                $id = null;

                if (str_contains($route['route'], 'user/{id}')) {
                    $route['route'] = explode('/{id}', $route['route'])[0];
                    $get_id = explode('/', $_SERVER['REQUEST_URI']);
                    $id = $get_id[sizeof($get_id) - 1];
                    $route['route'] = $route['route'] . '/' . $id;             
                }

                if ($_SERVER['REQUEST_URI'] === $route['route']) {
                    $route_found = true;

                    // Run permission_callback.  If authentication passes, go to view assigned to route.  Otherwise redirect to unauthorized_redirect view 
                    
                    if ($route['protect'] === true) {
                        if ($permission_callback && $unauthorized_redirect) {
                            include $this->file_path . '/' . $route['view'] . '.php';
                        } else {
                            if ($route['view'] !== $unauthorized_redirect) {
                                header('Location: '. '/' . $unauthorized_redirect);
                            } else include $this->file_path . '/' . $route['view'] . '.php';
                        }

                    // Load route if protect is set to false

                    } else {
                        include $this->file_path . '/' . $route['view'] . '.php';
                    } 
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