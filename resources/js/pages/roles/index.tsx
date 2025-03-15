import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { RolePageProps, type Role } from '@/types/users';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/ui/data-table';
import { type Column } from '@/types/data-table';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatModelName } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { PermissionGuard } from '@/components/permission-guard';
import { usePermissions } from '@/hooks/use-permissions';
import Alert, { AlertTitle, AlertDescription } from '@/components/ui/alert';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

export default function Index({ roles, filters }: RolePageProps) {
    const { can } = usePermissions();

    const columns: Column<Role>[] = [
        {
            header: '#',
            accessorKey: 'id',
            cell: (_: Role, index: number) => {
                const pageNumber = Math.max(1, roles.current_page);
                const itemsPerPage = roles.per_page;
                return ((pageNumber - 1) * itemsPerPage) + index + 1;
            },
            className: 'w-14 text-muted-foreground text-center'
        },
        {
            header: 'Name',
            accessorKey: 'name',
            cell: (row: Role) => (
                <div className="flex items-center">
                    <span className="font-medium">{row.name}</span>
                </div>
            ),
            className: 'min-w-[200px]',
            sortable: true
        },
        {
            header: 'Permissions',
            accessorKey: 'permissions',
            cell: (row: Role) => {
                const groupedPermissions = row.permissions.reduce((acc, permission) => {
                    const [action, model] = permission.name.split('-');
                    const group = permission.group || 'other';

                    if (!acc[group]) {
                        acc[group] = {};
                    }
                    if (!acc[group][model]) {
                        acc[group][model] = [];
                    }
                    acc[group][model].push({ ...permission, action });
                    return acc;
                }, {} as Record<string, Record<string, Array<typeof row.permissions[0] & { action: string }>>>);

                return (
                    <div className="flex flex-col gap-3">
                        {Object.entries(groupedPermissions).map(([group, models]) => (
                            <div key={group} className="space-y-1">
                                <div className="flex flex-wrap items-start gap-2">
                                    {Object.entries(models).sort(([a], [b]) => a.localeCompare(b)).map(([model, permissions]) => {
                                        const actions = permissions.map(p => p.action);
                                        const hasAllActions = ['view', 'create', 'update', 'delete'].every(action => 
                                            actions.includes(action)
                                        );

                                        return (
                                            <TooltipProvider key={model} delayDuration={200}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="group relative">
                                                            <Badge 
                                                                variant="outline" 
                                                                className={cn(
                                                                    "px-2 py-1 text-xs font-medium capitalize border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer",
                                                                    hasAllActions && "border-primary/30 bg-primary/10 hover:bg-primary/15"
                                                                )}
                                                            >
                                                                <div className="flex items-center gap-1.5">
                                                                    <span>{formatModelName(model)}</span>
                                                                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-1.5 text-[10px] tabular-nums text-primary">
                                                                        {permissions.length}
                                                                    </span>
                                                                </div>
                                                            </Badge>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent 
                                                        side="bottom" 
                                                        className="w-[200px] bg-white dark:bg-zinc-950 border dark:border-zinc-800"
                                                    >
                                                        <div className="space-y-2">
                                                            <div className="text-xs font-medium capitalize border-b pb-1 border-zinc-200 dark:border-zinc-800">
                                                                {formatModelName(model)} Permissions
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-1">
                                                                {['view', 'create', 'update', 'delete'].map(action => (
                                                                    <Badge
                                                                        key={action}
                                                                        variant="secondary"
                                                                        className={cn(
                                                                            "px-1.5 py-0.5 text-[10px] font-medium capitalize w-fit",
                                                                            actions.includes(action)
                                                                                ? "bg-primary/10 text-primary dark:bg-primary/20"
                                                                                : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                                                                        )}
                                                                    >
                                                                        {action}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            },
            className: 'min-w-[350px]'
        },
        {
            header: 'Created',
            accessorKey: 'created_at',
            cell: (row: Role) => (
                <div className="flex items-center">
                    <span className="text-muted-foreground text-sm">
                        {formatDate(row.created_at)}
                    </span>
                </div>
            ),
            className: 'w-[180px]',
            sortable: true
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <PermissionGuard 
                permission="view-roles"
                fallback={
                    <Alert>
                        <AlertDescription>
                            You don't have permission to view roles.
                        </AlertDescription>
                    </Alert>
                }
            >
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <DataTable
                        data={roles}
                        columns={columns}
                        filters={filters}
                        routeName="roles.index"
                        createRoute={can('create-roles') ? 'roles.create' : undefined}
                        actions={{
                            edit: can('update-roles') ? {
                                route: 'roles.edit',
                                label: 'Edit role'
                            } : undefined,
                            delete: can('delete-roles') ? {
                                route: 'roles.destroy',
                                label: 'Delete role'
                            } : undefined
                        }}
                    />
                </div>
            </PermissionGuard>
        </AppLayout>
    );
} 