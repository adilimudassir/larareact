import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue 
} from '@/components/ui/select';
import { PaginationProps } from '@/types/data-table';
import { cn } from '@/lib/utils';

export function DataTablePagination<T>({
    data,
    routeName,
    className,
    preserveScroll = true,
    preserveState = true,
    queryParams = {},
    pageSizeOptions = [10, 20, 50, 100, 500],
    isLoading = false
}: PaginationProps<T>) {
    const handlePageChange = (url: string) => {
        if (!url || isLoading) return;

        const urlObj = new URL(url);
        const page = urlObj.searchParams.get('page');
        const currentPerPage = urlObj.searchParams.get('per_page') || data.per_page.toString();

        router.get(
            route(routeName),
            {
                page,
                per_page: currentPerPage,
                ...queryParams
            },
            {
                preserveState,
                preserveScroll,
                replace: true
            }
        );
    };

    const handlePageSizeChange = (value: string) => {
        if (isLoading) return;

        router.get(
            route(routeName),
            {
                per_page: value,
                ...queryParams
            },
            {
                preserveState,
                preserveScroll,
                replace: true
            }
        );
    };

    return (
        <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                    Showing {data.from} to {data.to} of {data.total} items
                </span>
                <Select
                    value={data.per_page.toString()}
                    onValueChange={handlePageSizeChange}
                    disabled={isLoading}
                >
                    <SelectTrigger className="h-8 w-[100px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {pageSizeOptions.map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                                {size} per page
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-center gap-2">
                {data.links.map((link, i) => {
                    // Skip "prev" and "next" text links as we'll use icons
                    if (link.label === "&laquo; Previous" || link.label === "Next &raquo;") {
                        return null;
                    }

                    // For first and last items, show arrow icons
                    if (i === 0) {
                        return (
                            <Button
                                key={link.label}
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "h-8 w-8 p-0",
                                    !link.url && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={!link.url || isLoading}
                                onClick={() => link.url && handlePageChange(link.url)}
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
                                className={cn(
                                    "h-8 w-8 p-0",
                                    !link.url && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={!link.url || isLoading}
                                onClick={() => link.url && handlePageChange(link.url)}
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
                            className="h-8 min-w-[2rem]"
                            disabled={link.active || isLoading}
                            onClick={() => link.url && handlePageChange(link.url)}
                        >
                            {link.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
} 