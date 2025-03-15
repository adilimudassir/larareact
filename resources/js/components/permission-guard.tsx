import { usePermissions } from '@/hooks/use-permissions';
import { type PropsWithChildren } from 'react';

interface PermissionGuardProps {
    permission?: string;
    permissions?: string[];
    requireAll?: boolean;
    fallback?: React.ReactNode;
}

export function PermissionGuard({
    children,
    permission,
    permissions = [],
    requireAll = false,
    fallback = null,
}: PropsWithChildren<PermissionGuardProps>) {
    const { can, hasAllPermissions, hasAnyPermission } = usePermissions();

    if (permission && !can(permission)) {
        return fallback;
    }

    if (permissions.length > 0) {
        const hasPermission = requireAll
            ? hasAllPermissions(permissions)
            : hasAnyPermission(permissions);

        if (!hasPermission) {
            return fallback;
        }
    }

    return <>{children}</>;
} 