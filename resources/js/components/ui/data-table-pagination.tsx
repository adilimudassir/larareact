import { router, usePage } from '@inertiajs/react';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { PaginationProps } from "@/types/data-table";

export interface PaginatedData<T> {
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

interface PageProps {
    pageSizeOptions: number[];
    defaultPageSize: number;
}

export function DataTablePagination<T>({ 
    data,
    routeName,
    queryParams = {},
    preserveScroll = true,
    preserveState = true
}: PaginationProps<T>) {
    const { pageSizeOptions, defaultPageSize } = usePage<{ props: PageProps }>().props;
    const [isLoading, setIsLoading] = useState(false);

    const getCurrentParams = () => {
        const params = new URLSearchParams(window.location.search);
        const currentParams: Record<string, string | number> = {};
        
        params.forEach((value, key) => {
            currentParams[key] = value;
        });

        return currentParams;
    };

    const handlePageSizeChange = (value: string) => {
        setIsLoading(true);
        const pageSize = parseInt(value);
        
        // Remove existing per_page from current params to avoid duplication
        const currentParams = getCurrentParams();
        delete currentParams.per_page;
        delete currentParams.page; // Reset page when changing page size
        
        router.get(
            route(routeName), 
            { 
                ...currentParams,
                ...queryParams,
                per_page: pageSize,
                page: 1
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onSuccess: () => {
                    setIsLoading(false);
                },
                onError: () => setIsLoading(false)
            }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route(routeName, { page }),
            { ...queryParams },
            { preserveState, preserveScroll }
        );
    };

    const getVisiblePages = () => {
        const totalPages = data.last_page;
        const currentPage = data.current_page;
        const delta = 2; // Number of pages to show before and after current page

        const pages: (number | string)[] = [];
        
        // Always show first page
        pages.push(1);
        
        if (currentPage > delta + 2) {
            pages.push('...');
        }
        
        // Calculate range around current page
        const rangeStart = Math.max(2, currentPage - delta);
        const rangeEnd = Math.min(totalPages - 1, currentPage + delta);
        
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i);
        }
        
        if (currentPage < totalPages - (delta + 1)) {
            pages.push('...');
        }
        
        // Always show last page if not already included
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        
        return pages;
    };

    // Format the page size for display
    const formatPageSize = (size: number) => `${size} Per Page`;
    
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
            <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                    Showing {data.from} to {data.to} of {data.total} {data.total === 1 ? "entry" : "entries"}
                </p>
                <Select
                    value={data.per_page.toString()}
                    onValueChange={handlePageSizeChange}
                    disabled={isLoading}
                >
                    <SelectTrigger className="h-9 w-[160px]">
                        <SelectValue>{formatPageSize(data.per_page)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {(pageSizeOptions as number[]).map((size: number) => (
                            <SelectItem 
                                key={size} 
                                value={size.toString()}
                            >
                                {formatPageSize(size)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center justify-end gap-2">
                <Button
                    variant="outline"
                    className="h-9 w-9 p-0"
                    onClick={() => handlePageChange(data.current_page - 1)}
                    disabled={!data.prev_page_url}
                >
                    <span className="sr-only">Previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {getVisiblePages().map((page, index) => (
                    <div key={index}>
                        {page === '...' ? (
                            <span className="px-2 text-muted-foreground">...</span>
                        ) : (
                            <Button
                                variant={data.current_page === page ? "default" : "outline"}
                                className="h-9 w-9 p-0"
                                onClick={() => typeof page === 'number' && handlePageChange(page)}
                            >
                                <span className="sr-only">Page {page}</span>
                                {page}
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    variant="outline"
                    className="h-9 w-9 p-0"
                    onClick={() => handlePageChange(data.current_page + 1)}
                    disabled={!data.next_page_url}
                >
                    <span className="sr-only">Next page</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
} 