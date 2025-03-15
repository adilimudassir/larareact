export interface PaginationData<T> {
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

export interface PaginationProps<T> {
    data: PaginationData<T>;
    routeName: string;
    className?: string;
    preserveScroll?: boolean;
    preserveState?: boolean;
    /** Additional query parameters to preserve during pagination */
    queryParams?: Record<string, string>;
    /** Custom page size options */
    pageSizeOptions?: number[];
    /** Optional loading state */
    isLoading?: boolean;
}

export interface Column<T> {
    header: string | (() => React.ReactNode);
    accessorKey: string;
    cell?: (row: T, index: number) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

export interface ActionConfig {
    show?: {
        route: string;
        label: string;
    };
    edit?: {
        route: string;
        label: string;
    };
    delete?: {
        route: string;
        label: string;
    };
}

export interface BulkActionConfig {
    id: string; // Unique identifier for the action
    route: string;
    label: string;
    method?: 'post' | 'put' | 'patch' | 'delete';
    variant?: 'default' | 'destructive' | 'outline';
    className?: string;
    icon?: React.ReactNode;
    data?: Record<string, any>; // Additional data to send with the request
    confirmTitle?: string;
    confirmDescription?: string;
} 