<?php

    // PAGE VIEWS

    $pages_file_path = dirname(dirname(__DIR__)) . '/frontend/pages';

    $pages = new View($pages_file_path, true, '404');

        // Setup page routes

        $pages->create([
            [
                'route' => '/login',
                'view' => 'login'
            ],
            [
                'route' => '/edit',
                'view' => 'edit'
            ],
            [
                'route' => '/preview',
                'view' => 'preview'
            ],
        ]);