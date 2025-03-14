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

export default function Index({ todos }: Props) {
    const { flash } = usePage<SharedPageProps>().props;
    const [creating, setCreating] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (flash.success) {
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

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
                <div className="flex justify-end">
                    <Button 
                        asChild 
                        loading={creating}
                        onClick={() => setCreating(true)}
                    >
                        <Link href={route('todos.create')}>
                            {creating ? null : <PlusIcon className="size-4" />}
                            {creating ? 'Creating...' : 'Create Todo'}
                        </Link>
                    </Button>
                </div>
                <TodoList todos={todos.data} />
                <DataTablePagination 
                    data={todos} 
                    routeName="todos.index"
                    queryParams={{
                        // search: searchTerm,
                        // sort: sortColumn,
                        // direction: sortDirection,
                    }}
                    onPageChange={() => {
                        // Additional logic after page change
                    }}
                />
            </div>
        </AppLayout>
    );
} 