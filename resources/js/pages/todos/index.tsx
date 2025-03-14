import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import Alert, { AlertTitle } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import type { Column } from '@/types/data-table';
import type { Todo, TodoPageProps } from '@/types/todos';
import type { SharedPageProps } from '@/types/api';

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
                return ((pageNumber - 1) * itemsPerPage) + index + 1;
            },
            className: 'w-16 text-muted-foreground'
        },
        {
            header: 'Title',
            accessorKey: 'title',
            cell: (row: Todo) => <span className="font-medium">{row.title}</span>,
            sortable: true
        },
        {
            header: 'Description',
            accessorKey: 'description',
            cell: (row: Todo) => (
                <span className="text-muted-foreground">
                    {row.description || 'No description'}
                </span>
            ),
            sortable: true
        },
        {
            header: 'Status',
            accessorKey: 'completed',
            cell: (row: Todo) => (
                <Badge variant={row.completed ? "success" : "secondary"}>
                    {row.completed ? 'Completed' : 'Pending'}
                </Badge>
            ),
            sortable: true
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Todos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showAlert && (
                    <Alert variant="default">
                        <CheckCircle2 className="text-green-500" />
                        <AlertTitle>{flash.success}</AlertTitle>
                    </Alert>
                )}

                <DataTable
                    data={todos}
                    columns={columns}
                    filters={filters}
                    routeName="todos.index"
                    createRoute="todos.create"
                    createButtonLabel="Create Todo"
                    actions={{
                        show: {
                            route: 'todos.show',
                            label: 'Show'
                        },
                        edit: {
                            route: 'todos.edit',
                            label: 'Edit'
                        },
                        delete: {
                            route: 'todos.destroy',
                            label: 'Delete'
                        }
                    }}
                />
            </div>
        </AppLayout>
    );
} 