import type { PaginationData, Filters } from './api';

export interface Todo {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
}

export interface TodoPageProps {
    todos: PaginationData<Todo>;
    filters: Filters;
} 