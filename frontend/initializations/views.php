<?php

    $root_url = dirname(dirname(__DIR__));

    // PAGE VIEWS

    $pages_file_path = $root_url . '/frontend/pages';

    $pages = new View($pages_file_path, true, '404');

        // Setup page routes.  All routes protected for logged in users only access, except for login page which has public access.

        $pages->create([
                [
                    'route' => '/',
                    'view' => 'home',
                    'protect' => true
                ],
                [
                    'route' => '/login',
                    'view' => 'login',
                    'protect' => false
                ],
                [
                    'route' => '/edit',
                    'view' => 'edit',
                    'protect' => true
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