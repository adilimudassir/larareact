import { router } from '@inertiajs/react';
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

interface DataTablePaginationProps<T> {
    data: PaginatedData<T>;
    routeName: string;
    queryParams?: Record<string, string | number>;
    onPageChange?: () => void;
}

const PAGE_SIZES = [10, 15, 30, 50, 100] as const;
type PageSize = typeof PAGE_SIZES[number];

export function DataTablePagination<T>({ 
    data, 
    routeName,
    queryParams = {},
    onPageChange 
}: DataTablePaginationProps<T>) {
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
        const pageSize = parseInt(value) as PageSize;
        
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
                    onPageChange?.();
                    setIsLoading(false);
                },
                onError: () => setIsLoading(false)
            }
        );
    };

    const handlePageClick = (url: string | null) => {
        if (!url) return;
        setIsLoading(true);

        const urlObj = new URL(url);
        const page = urlObj.searchParams.get('page');
        
        router.get(
            route(routeName),
            {
                ...getCurrentParams(),
                ...queryParams,
                page: page || 1,
                per_page: data.per_page
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onSuccess: () => {
                    onPageChange?.();
                    setIsLoading(false);
                },
                onError: () => setIsLoading(false)
            }
        );
    };

    // Format the page size for display
    const formatPageSize = (size: number) => `${size} per page`;
    
    // Get current page size label
    const currentPageSizeLabel = formatPageSize(data.per_page);

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                    Showing {data.from} to {data.to} of {data.total} items
                </span>
                <Select
                    value={data.per_page.toString()}
                    onValueChange={handlePageSizeChange}
                    disabled={isLoading}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue>
                            {currentPageSizeLabel}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {PAGE_SIZES.map((size) => (
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

            <div className="flex items-center justify-center gap-2">
                {data.links.map((link, i) => {
                    if (link.label === "&laquo; Previous" || link.label === "Next &raquo;") {
                        return null;
                    }

                    if (i === 0) {
                        return (
                            <Button
                                key={link.label}
                                variant="outline"
                                size="sm"
                                className={!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                                disabled={!link.url || isLoading}
                                onClick={() => handlePageClick(link.url)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        );
                    }

                    if (i === data.links.length - 1) {
                        return (
                            <Button
                                key={link.label}
                                variant="outline"
                                size="sm"
                                className={!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                                disabled={!link.url || isLoading}
                                onClick={() => handlePageClick(link.url)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        );
                    }

                    return (
                        <Button
                            key={link.label}
                            variant={link.active ? "default" : "outline"}
                            size="sm"
                            className="min-w-[2.25rem]"
                            disabled={isLoading}
                            onClick={() => handlePageClick(link.url)}
                        >
                            {link.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
} 