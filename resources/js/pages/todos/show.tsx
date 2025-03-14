import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Todo {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
}

interface Props {
    todo: Todo;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Todos',
        href: route('todos.index'),
    },
    {
        title: 'View Todo',
        href: '#',
    },
];

export default function Show({ todo }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Todo - ${todo.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6">
                    <h1 className="text-3xl font-bold mb-4">{todo.title}</h1>
                    {todo.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{todo.description}</p>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Status:</span>
                        <span className={`${todo.completed ? 'text-green-500' : 'text-yellow-500'}`}>
                            {todo.completed ? 'Completed' : 'Pending'}
                        </span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 