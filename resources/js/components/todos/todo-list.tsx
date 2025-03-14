import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';

interface Todo {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
}

interface Props {
    todos: Todo[];
}

export function TodoList({ todos }: Props) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleToggleComplete = (todo: Todo) => {
        router.put(route('todos.update', todo.id), {
            ...todo,
            completed: !todo.completed,
        });
    };

    const handleDeleteClick = (todo: Todo) => {
        setTodoToDelete(todo);
        setModalOpen(true);
    };

    const handleDelete = async (todo: Todo) => {
        setDeletingId(todo.id);
        try {
            await router.delete(route('todos.destroy', todo.id));
        } finally {
            setDeletingId(null);
        }
    };

    const confirmDelete = () => {
        if (todoToDelete) {
            router.delete(route('todos.destroy', todoToDelete.id), {
                onSuccess: () => setModalOpen(false)
            });
        }
    };

    return (
        <div className="space-y-4">
            {todos.length > 0 ? (
                todos.map((todo) => (
                    <div
                        key={todo.id}
                        className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Checkbox
                                    id={`todo-${todo.id}`}
                                    checked={todo.completed}
                                    onCheckedChange={() => handleToggleComplete(todo)}
                                />
                                <div>
                                    <h3 className={`font-semibold ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                                        {todo.title}
                                    </h3>
                                    {todo.description && (
                                        <p className="text-gray-600 dark:text-gray-400">{todo.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="default"
                                    onClick={() => router.get(route('todos.edit', todo.id))}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteClick(todo)}
                                    loading={deletingId === todo.id}
                                >
                                    Delete
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => router.get(route('todos.show', todo.id))}
                                >
                                    View
                                </Button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No todos available.</p>
            )}
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
} 