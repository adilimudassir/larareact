<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Clear cached roles and permissions to ensure fresh data
        $this->clearCachedPermissions();

        // Generate permissions from config
        $this->generatePermissions();

        // Create roles and synchronize their permissions
        $this->createAndSyncRoles();

        // Assign the super-admin role to the first user, if one exists
        $this->assignSuperAdminRoleToFirstUser();
    }

    private function clearCachedPermissions(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }

    private function generatePermissions(): void
    {
        $config = config('permissions');
        
        foreach ($config['models'] as $model => $settings) {
            $actions = array_keys($settings['actions'] ?? $config['default_actions']);
            
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name' => "{$action}-{$model}",
                    'display_name' => $settings['actions'][$action] ?? $config['default_actions'][$action],
                    'group' => $this->findModelGroup($model, $config['groups']),
                ]);
            }
        }
    }

    private function findModelGroup(string $model, array $groups): ?string
    {
        foreach ($groups as $key => $group) {
            if (in_array($model, $group['models'])) {
                return $key;
            }
        }
        return null;
    }

    private function createAndSyncRoles(): void
    {
        $roles = $this->getDefinedRoles();

        foreach ($roles as $roleName => $permissionFilter) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            
            if (is_callable($permissionFilter)) {
                $permissions = Permission::all()->filter($permissionFilter);
            } else {
                $permissions = $permissionFilter;
            }

            $role->syncPermissions($permissions);
        }
    }

    private function getDefinedRoles(): array
    {
        return [
            'super-admin' => fn() => true, // All permissions
            'admin' => fn(Permission $permission) => !str_contains($permission->name, 'roles'),
            'moderator' => fn(Permission $permission) => str_contains($permission->name, 'todos'),
            'user' => fn(Permission $permission) => 
                str_contains($permission->name, 'todos') && 
                in_array(explode('-', $permission->name)[0], ['view', 'create', 'update', 'delete']),
        ];
    }

    private function assignSuperAdminRoleToFirstUser(): void
    {
        $user = \App\Models\User::first();
        if ($user) {
            $user->assignRole('super-admin');
        }
    }
}