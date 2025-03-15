import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
}

const MODEL_DISPLAY_NAMES: Record<string, string> = {
    users: 'Users',
    roles: 'Roles',
    permissions: 'Permissions',
    todos: 'Todo',
};

export function formatModelName(model: string): string {
    return MODEL_DISPLAY_NAMES[model] || model.charAt(0).toUpperCase() + model.slice(1);
}
