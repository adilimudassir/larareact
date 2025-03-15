import Alert, { AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { SharedPageProps } from '@/types/api';
import type { BulkActionConfig, Column } from '@/types/data-table';
import type { Todo, TodoPageProps } from '@/types/todos';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircle, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Todos',
        href: route('todos.index'),
    },
];

export default function Index({ todos, filters }: TodoPageProps) {
    const { flash } = usePage<SharedPageProps>().props;
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (flash.success) {
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    const columns: Column<Todo>[] = [
        {
            header: '#',
            accessorKey: 'id',
            cell: (_: Todo, index: number) => {
                const pageNumber = Math.max(1, todos.current_page);
                const itemsPerPage = todos.per_page;
                return (pageNumber - 1) * itemsPerPage + index + 1;
            },
            className: 'w-16 text-muted-foreground',
        },
        {
            header: 'Title',
            accessorKey: 'title',
            cell: (row: Todo) => <span className="font-medium">{row.title}</span>,
            sortable: true,
        },
        {
            header: 'Description',
            accessorKey: 'description',
            cell: (row: Todo) => <span className="text-muted-foreground">{row.description || 'No description'}</span>,
            sortable: true,
        },
        {
            header: 'Status',
            accessorKey: 'completed',
            cell: (row: Todo) => <Badge variant={row.completed ? 'success' : 'secondary'}>{row.completed ? 'Completed' : 'Pending'}</Badge>,
            sortable: true,
        },
    ];

    const bulkActions: BulkActionConfig[] = [
        {
            id: 'mark-complete',
            route: 'todos.bulk.update',
            method: 'put',
            label: 'Mark Complete',
            variant: 'outline',
            className: 'text-green-600 hover:text-green-700',
            icon: <CheckCircle className="mr-2 h-4 w-4" />,
            data: { completed: true },
        },
        {
            id: 'mark-incomplete',
            route: 'todos.bulk.update',
            method: 'put',
            label: 'Mark Incomplete',
            variant: 'outline',
            className: 'text-yellow-600 hover:text-yellow-700',
            icon: <XCircle className="mr-2 h-4 w-4" />,
            data: { completed: false },
        },
        {
            id: 'delete-selected',
            route: 'todos.bulk.destroy',
            method: 'delete',
            label: 'Delete Selected',
            variant: 'outline',
            className: 'text-red-600 hover:text-red-700',
            icon: <Trash2 className="mr-2 h-4 w-4" />,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Todos"  />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showAlert && (
                    <Alert variant="default">
                        <CheckCircle className="text-green-500" />
                        <AlertTitle>{flash.success}</AlertTitle>
                    </Alert>
                )}

                <DataTable
                    data={todos}
                    columns={columns}
                    filters={filters}
                    routeName="todos.index"
                    createRoute="todos.create"
                    actions={{
                        show: {
                            route: 'todos.show',
                            label: 'Show',
                        },
                        edit: {
                            route: 'todos.edit',
                            label: 'Edit',
                        },
                        delete: {
                            route: 'todos.destroy',
                            label: 'Delete',
                        },
                    }}
                    bulkActions={bulkActions}
                />
            </div>
        </AppLayout>
    );
}
