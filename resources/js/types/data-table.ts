/**
 * Represents a paginated response from the server
 */
export interface PaginationData<T> {
    /** Current page number */
    current_page: number;
    /** Array of items for the current page */
    data: T[];
    /** URL for the first page */
    first_page_url: string;
    /** Starting index of current page */
    from: number;
    /** Total number of pages */
    last_page: number;
    /** URL for the last page */
    last_page_url: string;
    /** Array of pagination links */
    links: Array<PaginationLink>;
    /** URL for the next page */
    next_page_url: string | null;
    /** Base path for pagination URLs */
    path: string;
    /** Number of items per page */
    per_page: number;
    /** URL for the previous page */
    prev_page_url: string | null;
    /** Ending index of current page */
    to: number;
    /** Total number of items across all pages */
    total: number;
}

/**
 * Represents a pagination link item
 */
export interface PaginationLink {
    /** URL for the page, null for ellipsis */
    url: string | null;
    /** Label for the link (page number or ellipsis) */
    label: string;
    /** Whether this is the current active page */
    active: boolean;
}

/**
 * Props for the DataTablePagination component
 */
export interface PaginationProps<T> {
    /** Paginated data from the server */
    data: PaginationData<T>;
    /** Route name for pagination links */
    routeName: string;
    /** Optional CSS class name */
    className?: string;
    /** Whether to preserve scroll position when paginating */
    preserveScroll?: boolean;
    /** Whether to preserve component state when paginating */
    preserveState?: boolean;
    /** Additional query parameters to preserve during pagination */
    queryParams?: Record<string, string>;
    /** Custom page size options */
    pageSizeOptions?: number[];
    /** Optional loading state */
    isLoading?: boolean;
}

/**
 * Configuration for a data table column
 */
export interface Column<T> {
    /** Column header text or render function */
    header: string | (() => React.ReactNode);
    /** Key to access data from row object */
    accessorKey: string;
    /** Optional custom cell render function */
    cell?: (row: T, index: number) => React.ReactNode;
    /** Whether column is sortable */
    sortable?: boolean;
    /** Optional CSS class name */
    className?: string;
}

/**
 * Configuration for row actions (view/edit/delete)
 */
export interface ActionConfig {
    /** View action configuration */
    show?: ActionItem;
    /** Edit action configuration */
    edit?: ActionItem;
    /** Delete action configuration */
    delete?: ActionItem;
}

/**
 * Configuration for an individual action
 */
export interface ActionItem {
    /** Route name for the action */
    route: string;
    /** Label for accessibility */
    label: string;
    /** Optional function to determine if action should be shown */
    shouldShow?: (row: any) => boolean;
}

/**
 * Configuration for bulk actions
 */
export interface BulkActionConfig {
    /** Unique identifier for the action */
    id: string;
    /** Route name for the action */
    route: string;
    /** Display label for the action */
    label: string;
    /** HTTP method for the action */
    method?: 'post' | 'put' | 'patch' | 'delete';
    /** Button variant */
    variant?: 'default' | 'destructive' | 'outline';
    /** Optional CSS class name */
    className?: string;
    /** Optional icon component */
    icon?: React.ReactNode;
    /** Additional data to send with the request */
    data?: Record<string, unknown>;
    /** Custom confirmation dialog title */
    confirmTitle?: string;
    /** Custom confirmation dialog description */
    confirmDescription?: string;
}

/**
 * Props for the DataTable component
 */
export interface DataTableProps<T extends { id: number }> {
    /** Paginated data from the server */
    data: PaginationData<T>;
    /** Column configurations */
    columns: Column<T>[];
    /** Current filter state */
    filters: {
        search: string;
        sort: string;
        direction: string;
    };
    /** Route name for table actions */
    routeName: string;
    /** Optional route for create action */
    createRoute?: string;
    /** Optional label for create button */
    createButtonLabel?: string;
    /** Row action configurations */
    actions?: ActionConfig;
    /** Bulk action configurations */
    bulkActions?: BulkActionConfig[];
    /** Optional custom sort handler */
    onSort?: (field: string) => void;
}
