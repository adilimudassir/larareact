<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Permission Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for all permissions in the system.
    | Each model can have its own set of actions and display settings.
    |
    */

    'models' => [
        'users' => [
            'display_name' => 'Users',
            'description' => 'Manage system users',
            'actions' => [
                'view' => 'View users',
                'create' => 'Create new users',
                'update' => 'Update existing users',
                'delete' => 'Delete users',
            ],
        ],
        'roles' => [
            'display_name' => 'Roles',
            'description' => 'Manage user roles',
            'actions' => [
                'view' => 'View roles',
                'create' => 'Create new roles',
                'update' => 'Update existing roles',
                'delete' => 'Delete roles',
            ],
        ],
        'permissions' => [
            'display_name' => 'Permissions',
            'description' => 'Manage permissions',
            'actions' => [
                'view' => 'View permissions',
                'create' => 'Create new permissions',
                'update' => 'Update existing permissions',
                'delete' => 'Delete permissions',
            ],
        ],
        'todos' => [
            'display_name' => 'Todo Items',
            'description' => 'Manage todo items',
            'actions' => [
                'view' => 'View todo items',
                'create' => 'Create new todo items',
                'update' => 'Update existing todo items',
                'delete' => 'Delete todo items',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Actions
    |--------------------------------------------------------------------------
    |
    | Default actions that will be available for all models unless overridden
    | in the model's specific configuration above.
    |
    */
    'default_actions' => [
        'view' => 'View records',
        'create' => 'Create new records',
        'update' => 'Update existing records',
        'delete' => 'Delete records',
    ],

    /*
    |--------------------------------------------------------------------------
    | Permission Groups
    |--------------------------------------------------------------------------
    |
    | Group permissions by category for better organization in the UI
    |
    */
    'groups' => [
        'user-management' => [
            'display_name' => 'User Management',
            'description' => 'User and role management permissions',
            'models' => ['users', 'roles', 'permissions'],
        ],
        'content-management' => [
            'display_name' => 'Content Management',
            'description' => 'Content related permissions',
            'models' => ['todos'],
        ],
    ],
]; 