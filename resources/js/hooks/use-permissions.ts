import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export function usePermissions() {
    const { auth } = usePage<SharedData>().props;
    const permissions = auth.permissions || [];

    const can = (permission: string): boolean => {
        return permissions.includes(permission);
    };

    const cannot = (permission: string): boolean => {
        return !can(permission);
    };

    const hasAnyPermission = (requiredPermissions: string[]): boolean => {
        return requiredPermissions.some(permission => can(permission));
    };

    const hasAllPermissions = (requiredPermissions: string[]): boolean => {
        return requiredPermissions.every(permission => can(permission));
    };

    return {
        can,
        cannot,
        hasAnyPermission,
        hasAllPermissions,
        permissions,
    };
} 