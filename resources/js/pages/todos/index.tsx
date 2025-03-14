import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Alert, { AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Pencil, Trash2, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SearchInput } from '@/components/ui/search-input';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmationModal } from '@/components/todos/delete-confirmation-modal';
import { DataTable, type Column } from '@/components/ui/data-table';

interface Todo {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
}

interface PaginationData<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface Props {
    todos: PaginationData<Todo>;
    filters: {
        search: string;
        sort: string;
        direction: string;
    };
}

interface SharedPageProps {
    flash: {
        success?: string;
    };
    [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Todos',
        href: route('todos.index'),
    },
];

export default function Index({ todos, filters }: Props) {
    const { flash } = usePage<SharedPageProps>().props;
    const [creating, setCreating] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [viewLoading, setViewLoading] = useState<number | null>(null);
    const [editLoading, setEditLoading] = useState<number | null>(null);

    useEffect(() => {
        if (flash.success) {
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    const handleSearch = (value: string) => {
        router.get(
            route('todos.index'),
            { search: value, sort: filters.sort, direction: filters.direction },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleDeleteClick = (todo: Todo) => {
        setTodoToDelete(todo);
        setModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!todoToDelete) return;

        setIsDeleting(true);
        router.delete(route('todos.destroy', todoToDelete.id), {
            onSuccess: () => {
                setModalOpen(false);
                setTodoToDelete(null);
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            }
        });
    };

    const handleViewClick = (todoId: number) => {
        setViewLoading(todoId);
        router.get(route('todos.show', todoId));
    };

    const handleEditClick = (todoId: number) => {
        setEditLoading(todoId);
        router.get(route('todos.edit', todoId));
    };

    const columns: Column<Todo>[] = [
        {
            header: '#',
            accessorKey: 'id',
            cell: (_, index) => {
                const pageNumber = Math.max(1, todos.current_page);
                const itemsPerPage = todos.per_page;
                return ((pageNumber - 1) * itemsPerPage) + index + 1;
            },
            className: 'w-16 text-muted-foreground'
        },
        {
            header: 'Title',
            accessorKey: 'title',
            cell: (row) => <span className="font-medium">{row.title}</span>,
            sortable: true
        },
        {
            header: 'Description',
            accessorKey: 'description',
            cell: (row) => (
                <span className="text-muted-foreground">
                    {row.description || 'No description'}
                </span>
            ),
            sortable: true
        },
        {
            header: 'Status',
            accessorKey: 'completed',
            cell: (row) => (
                <Badge variant={row.completed ? "success" : "secondary"}>
                    {row.completed ? 'Completed' : 'Pending'}
                </Badge>
            ),
            sortable: true
        },
        {
            header: 'Actions',
            accessorKey: 'actions',
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                        onClick={() => handleViewClick(row.id)}
                        loading={viewLoading === row.id}
                    >
                        {viewLoading === row.id ? null : <Eye className="h-4 w-4" />}
                        <span className="sr-only">View</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                        onClick={() => handleEditClick(row.id)}
                        loading={editLoading === row.id}
                    >
                        {editLoading === row.id ? null : <Pencil className="h-4 w-4" />}
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        onClick={() => handleDeleteClick(row)}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            ),
            className: 'text-right'
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
                <div className="flex items-center justify-between gap-4">
                    <SearchInput 
                        value={filters.search} 
                        onChange={handleSearch} 
                    />
                    <Button asChild loading={creating}>
                        <Link href={route('todos.create')}>
                            {creating ? null : <PlusIcon className="size-4" />}
                            {creating ? 'Creating...' : 'Create Todo'}
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={todos}
                    columns={columns}
                    filters={filters}
                    routeName="todos.index"
                />

                <DeleteConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setTodoToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    loading={isDeleting}
                    title="Delete Todo"
                    description={
                        todoToDelete
                            ? `Are you sure you want to delete "${todoToDelete.title}"? This action cannot be undone.`
                            : 'Are you sure you want to delete this todo?'
                    }
                />
            </div>
        </AppLayout>
    );
} 