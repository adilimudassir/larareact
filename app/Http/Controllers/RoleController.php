<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy(request('sort', 'name'), request('direction', 'asc'))
            ->paginate(request('per_page', 10))
            ->withQueryString();

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'filters' => request()->only(['search', 'sort', 'direction']),
        ]);
    }

    public function create()
    {
        $permissions = Permission::all();
        $models = $permissions->pluck('name')
            ->map(function ($name) {
                return explode('-', $name)[1];
            })
            ->unique()
            ->values()
            ->all();
        return Inertia::render('roles/create', [
            'permissions' => Permission::all(),
            'models' => $models,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'permissions' => 'array',
        ]);

        $role = Role::create(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        $permissions = Permission::all();
        $models = $permissions->pluck('name')
            ->map(function ($name) {
                return explode('-', $name)[1];
            })
            ->unique()
            ->values()
            ->all();

        return Inertia::render('roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions,
            ],
            'permissions' => $permissions,
            'models' => $models,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'array',
        ]);

        $role->update(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->route('roles.index')
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Role deleted successfully.');
    }
} 