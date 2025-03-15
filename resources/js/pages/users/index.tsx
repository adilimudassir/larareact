import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { type UserPageProps, type User } from '@/types/users';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/ui/data-table';
import { type Column } from '@/types/data-table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function Index({ users, filters }: UserPageProps) {
    const columns: Column<User>[] = [
        {
            header: '#',
            accessorKey: 'id',
            cell: (_: User, index: number) => {
                const pageNumber = Math.max(1, users.current_page);
                const itemsPerPage = users.per_page;
                return ((pageNumber - 1) * itemsPerPage) + index + 1;
            },
            className: 'w-14 text-muted-foreground text-center'
        },
        {
            header: 'Name',
            accessorKey: 'name',
            cell: (row: User) => (
                <div className="flex items-center">
                    <span className="font-medium">{row.name}</span>
                </div>
            ),
            className: 'min-w-[200px]',
            sortable: true
        },
        {
            header: 'Email',
            accessorKey: 'email',
            cell: (row: User) => (
                <div className="flex items-center">
                    <span className="text-muted-foreground">{row.email}</span>
                </div>
            ),
            className: 'min-w-[250px]',
            sortable: true
        },
        {
            header: 'Roles',
            accessorKey: 'roles',
            cell: (row: User) => (
                <div className="flex flex-wrap items-center gap-1.5">
                    {row.roles.map(role => (
                        <Badge 
                            key={role.id} 
                            variant="secondary"
                            className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
                        >
                            {role.name}
                        </Badge>
                    ))}
                </div>
            ),
            className: 'min-w-[200px]'
        },
        {
            header: 'Created',
            accessorKey: 'created_at',
            cell: (row: User) => formatDate(row.created_at),
            className: 'min-w-[200px]',
            sortable: true,
            
        },
        {
            header: 'Updated',
            accessorKey: 'updated_at',
            cell: (row: User) => formatDate(row.updated_at),
            className: 'min-w-[200px]',
            sortable: true,
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable
                    data={users}
                    columns={columns}
                    filters={filters}
                    routeName="users.index"
                    createRoute="users.create"
                    createButtonLabel="Create User"
                    actions={{
                        edit: {
                            route: 'users.edit',
                            label: 'Edit user'
                        },
                        delete: {
                            route: 'users.destroy',
                            label: 'Delete user'
                        }
                    }}
                />
            </div>
        </AppLayout>
    );
} 