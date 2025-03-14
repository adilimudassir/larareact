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