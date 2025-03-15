import { type User } from './users';

export interface SharedData {
    name: string;
    auth: {
        user: User | null;
        permissions: string[];
    };
    flash: {
        success: string | null;
        error: string | null;
    };
    pageSizeOptions: number[];
    defaultPageSize: number;
    [key: string]: any;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: any;
    permission?: string;
} 