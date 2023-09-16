<?php

    $root_url = dirname(dirname(__DIR__));

    // PAGE VIEWS

    $pages_file_path = $root_url . '/frontend/pages';

    $pages = new View($pages_file_path, true, '404');

        // Setup page routes.  Preview page route protected for users with authentication token only.

        $pages->create([
                [
                    'route' => '/',
                    'view' => 'home',
                    'protect' => false
                ],
                [
                    'route' => '/login',
                    'view' => 'login',
                    'protect' => false
                ],
                [
                    'route' => '/profile',
                    'view' => 'profile',
                    'protect' => false
                ],
                [
                    'route' => '/preview',
                    'view' => 'preview',
                    'protect' => true
                ]
            ], 
            user_page_authenticate(),
            'login'
        );