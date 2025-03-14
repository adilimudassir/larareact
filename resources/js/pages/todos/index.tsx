import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { TodoList } from '@/components/todos/todo-list';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Alert, { AlertTitle } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ArrowUpDown } from 'lucide-react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmationModal } from '@/components/todos/delete-confirmation-modal';

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

    const handleSort = (field: string) => {
        const direction = 
            filters.sort === field && filters.direction === 'asc' 
                ? 'desc' 
                : 'asc';
        
        router.get(
            route('todos.index'),
            { 
                search: filters.search, 
                sort: field, 
                direction 
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const getSortIcon = (field: string) => {
        if (filters.sort !== field) {
            return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
        }
        
        return (
            <ArrowUpDown 
                className={`ml-2 h-4 w-4 text-foreground ${
                    filters.direction === 'asc' ? 'transform rotate-180' : ''
                }`} 
            />
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

                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left w-16">
                                    <span className="text-sm font-medium">#</span>
                                </th>
                                <th 
                                    className="px-4 py-3 text-left cursor-pointer hover:bg-muted/70 transition-colors"
                                    onClick={() => handleSort('title')}
                                >
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium">Title</span>
                                        {getSortIcon('title')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 text-left cursor-pointer hover:bg-muted/70 transition-colors"
                                    onClick={() => handleSort('description')}
                                >
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium">Description</span>
                                        {getSortIcon('description')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 text-left cursor-pointer hover:bg-muted/70 transition-colors"
                                    onClick={() => handleSort('completed')}
                                >
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium">Status</span>
                                        {getSortIcon('completed')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-right">
                                    <span className="text-sm font-medium">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {todos.data.map((todo, index) => (
                                <tr 
                                    key={todo.id} 
                                    className="border-b hover:bg-muted/50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {todos.from + index}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-medium">{todo.title}</span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {todo.description || 'No description'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge 
                                            variant={todo.completed ? "success" : "secondary"}
                                        >
                                            {todo.completed ? 'Completed' : 'Pending'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-none border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                                                onClick={() => handleViewClick(todo.id)}
                                                loading={viewLoading === todo.id}
                                            >
                                                {viewLoading === todo.id ? null : <Eye className="h-4 w-4" />}
                                                <span className="sr-only">View</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-none border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                                                onClick={() => handleEditClick(todo.id)}
                                                loading={editLoading === todo.id}
                                            >
                                                {editLoading === todo.id ? null : <Pencil className="h-4 w-4" />}
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-none border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                                onClick={() => handleDeleteClick(todo)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <DataTablePagination 
                    data={todos} 
                    routeName="todos.index"
                    queryParams={{
                        search: filters.search,
                        sort: filters.sort,
                        direction: filters.direction,
                    }}
                />
            </div>
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
        </AppLayout>
    );
} 