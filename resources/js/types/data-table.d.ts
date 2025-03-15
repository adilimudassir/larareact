export interface Column<T> {
    header: string | (() => React.ReactNode);
    accessorKey: keyof T | string;
    cell?: (row: T, index?: number) => React.ReactNode;
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
    id: string;
    route: string;
    label: string;
    icon?: React.ReactNode;
    method?: 'post' | 'put' | 'patch' | 'delete';
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    className?: string;
    data?: Record<string, any>;
    confirmTitle?: string;
    confirmDescription?: string;
}
