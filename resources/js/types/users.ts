import { type PaginationData } from './api';

export interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
}

export interface Permission {
    id: number;
    name: string;
    display_name?: string;
    group?: string;
    created_at: string;
    updated_at: string;
}

export interface UserFormData {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    roles: number[];
}

export interface RoleFormData {
    name: string;
    permissions: number[];
}

export interface UserPageProps {
    users: PaginationData<User>;
    filters: {
        search: string;
        sort: string;
        direction: string;
    };
}

export interface RolePageProps {
    roles: PaginationData<Role>;
    filters: {
        search: string;
        sort: string;
        direction: string;
    };
} 