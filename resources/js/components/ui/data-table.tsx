import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";

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

export interface Column<T> {
    header: string;
    accessorKey: keyof T | string;
    cell?: (row: T, index: number) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

interface DataTableProps<T> {
    data: PaginatedData<T>;
    columns: Column<T>[];
    filters: {
        search: string;
        sort: string;
        direction: string;
    };
    routeName: string;
    onSort?: (field: string) => void;
}

export function DataTable<T>({ 
    data, 
    columns, 
    filters,
    routeName,
    onSort 
}: DataTableProps<T>) {
    const [tableLoading, setTableLoading] = useState(false);

    // Listen to Inertia events for loading state
    useEffect(() => {
        const handleStart = () => setTableLoading(true);
        const handleFinish = () => setTableLoading(false);

        document.addEventListener('inertia:start', handleStart);
        document.addEventListener('inertia:finish', handleFinish);

        return () => {
            document.removeEventListener('inertia:start', handleStart);
            document.removeEventListener('inertia:finish', handleFinish);
        };
    }, []);

    const handleSort = (field: string) => {
        if (!onSort) {
            const direction = 
                filters.sort === field && filters.direction === 'asc' 
                    ? 'desc' 
                    : 'asc';
            
            router.get(
                route(routeName),
                { 
                    search: filters.search, 
                    sort: field, 
                    direction 
                },
                { 
                    preserveState: true, 
                    preserveScroll: true
                }
            );
        } else {
            onSort(field);
        }
    };

    const getSortIcon = (field: string) => {
        if (!field) return null;
        
        return (
            <ArrowUpDown 
                className={`ml-2 h-4 w-4 ${
                    filters.sort === field 
                        ? 'text-foreground' 
                        : 'text-muted-foreground/50'
                } ${
                    filters.sort === field && filters.direction === 'asc' 
                        ? 'transform rotate-180' 
                        : ''
                }`} 
            />
        );
    };

    return (
        <div className="flex flex-col">
            <div className="border rounded-lg overflow-hidden relative">
                {tableLoading && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="text-sm font-medium text-muted-foreground">Loading...</span>
                        </div>
                    </div>
                )}
                <div className="min-h-[400px]">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                {columns.map((column, index) => (
                                    <th 
                                        key={index}
                                        className={`px-4 py-3 text-left ${
                                            column.sortable ? 'cursor-pointer hover:bg-muted/70 transition-colors' : ''
                                        } ${column.className || ''}`}
                                        onClick={() => column.sortable && handleSort(column.accessorKey as string)}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium">
                                                {column.header}
                                            </span>
                                            {column.sortable && getSortIcon(column.accessorKey as string)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.map((row, rowIndex) => (
                                <tr 
                                    key={rowIndex}
                                    className="border-b hover:bg-muted/50 transition-colors"
                                >
                                    {columns.map((column, colIndex) => (
                                        <td 
                                            key={colIndex} 
                                            className={`px-4 py-3 ${column.className || ''}`}
                                        >
                                            {column.cell 
                                                ? column.cell(row, rowIndex)
                                                : (row[column.accessorKey as keyof T] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {data.data.length === 0 && (
                                <tr>
                                    <td 
                                        colSpan={columns.length} 
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        No records found
                                    </td>
                                </tr>
                            )}
                            {data.data.length > 0 && data.data.length < 5 && (
                                Array(5 - data.data.length).fill(null).map((_, index) => (
                                    <tr key={`empty-${index}`} className="border-b">
                                        <td colSpan={columns.length} className="px-4 py-3">&nbsp;</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="py-4">
                <DataTablePagination 
                    data={data}
                    routeName={routeName}
                    queryParams={{
                        search: filters.search,
                        sort: filters.sort,
                        direction: filters.direction,
                    }}
                />
            </div>
        </div>
    );
} 