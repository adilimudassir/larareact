import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { ArrowUpDown, Loader2, PlusIcon, Eye, Pencil, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { DeleteConfirmationModal } from "@/components/data-table/delete-confirmation-modal";
import type { Column, ActionConfig } from "@/types/data-table";

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

interface DataTableProps<T> {
    data: PaginatedData<T>;
    columns: Column<T>[];
    filters: {
        search: string;
        sort: string;
        direction: string;
    };
    routeName: string;
    createRoute?: string;
    createButtonLabel?: string;
    actions?: ActionConfig;
    onSort?: (field: string) => void;
}

export function DataTable<T extends { id: number; title?: string }>({ 
    data, 
    columns, 
    filters,
    routeName,
    createRoute,
    createButtonLabel = 'Create New',
    actions,
    onSort 
}: DataTableProps<T>) {
    const [tableLoading, setTableLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [viewLoading, setViewLoading] = useState<number | null>(null);
    const [editLoading, setEditLoading] = useState<number | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<T | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Listen to Inertia events for loading state
    useEffect(() => {
        const handleStart = (event: any) => {
            if (event.detail.visit.method.toLowerCase() === 'get') {
                setTableLoading(true);
            }
        };
        const handleFinish = () => {
            setTableLoading(false);
            setCreating(false);
            setViewLoading(null);
            setEditLoading(null);
        };

        document.addEventListener('inertia:start', handleStart);
        document.addEventListener('inertia:finish', handleFinish);

        return () => {
            document.removeEventListener('inertia:start', handleStart);
            document.removeEventListener('inertia:finish', handleFinish);
        };
    }, []);

    const handleSearch = (value: string) => {
        router.get(
            route(routeName),
            { search: value, sort: filters.sort, direction: filters.direction },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSort = (field: string) => {
        if (!onSort) {
            const direction = 
                filters.sort === field && filters.direction === 'asc' 
                    ? 'desc' 
                    : 'asc';
            
            router.get(
                route(routeName),
                { search: filters.search, sort: field, direction },
                { preserveState: true, preserveScroll: true }
            );
        } else {
            onSort(field);
        }
    };

    const handleViewClick = (id: number) => {
        if (!actions?.show) return;
        setViewLoading(id);
        router.get(route(actions.show.route, id));
    };

    const handleEditClick = (id: number) => {
        if (!actions?.edit) return;
        setEditLoading(id);
        router.get(route(actions.edit.route, id));
    };

    const handleDeleteClick = (item: T) => {
        if (!actions?.delete) return;
        setItemToDelete(item);
        setModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete || !actions?.delete) return;

        setIsDeleting(true);
        router.delete(route(actions.delete.route, itemToDelete.id), {
            onSuccess: () => {
                setModalOpen(false);
                setItemToDelete(null);
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            }
        });
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

    // Add actions column if any actions are configured
    const columnsWithActions: Column<T>[] = actions 
        ? [
            ...columns,
            {
                header: 'Actions',
                accessorKey: 'actions',
                cell: (row: T) => (
                    <div className="flex items-center justify-end gap-2">
                        {actions.show && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-none border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                                onClick={() => handleViewClick(row.id)}
                                loading={viewLoading === row.id}
                            >
                                {viewLoading === row.id ? null : <Eye className="h-4 w-4" />}
                                <span className="sr-only">{actions.show.label}</span>
                            </Button>
                        )}
                        {actions.edit && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-none border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                                onClick={() => handleEditClick(row.id)}
                                loading={editLoading === row.id}
                            >
                                {editLoading === row.id ? null : <Pencil className="h-4 w-4" />}
                                <span className="sr-only">{actions.edit.label}</span>
                            </Button>
                        )}
                        {actions.delete && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-none border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                onClick={() => handleDeleteClick(row)}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">{actions.delete.label}</span>
                            </Button>
                        )}
                    </div>
                ),
                className: 'text-right'
            }
        ]
        : columns;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <SearchInput 
                    value={filters.search} 
                    onChange={handleSearch} 
                />
                {createRoute && (
                    <Button asChild loading={creating}>
                        <Link href={route(createRoute)}>
                            {creating ? null : <PlusIcon className="size-4" />}
                            {creating ? 'Creating...' : createButtonLabel}
                        </Link>
                    </Button>
                )}
            </div>

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
                                {columnsWithActions.map((column, index) => (
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
                                    {columnsWithActions.map((column, colIndex) => (
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
                                        colSpan={columnsWithActions.length} 
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        No records found
                                    </td>
                                </tr>
                            )}
                            {data.data.length > 0 && data.data.length < 5 && (
                                Array(5 - data.data.length).fill(null).map((_, index) => (
                                    <tr key={`empty-${index}`} className="border-b">
                                        <td colSpan={columnsWithActions.length} className="px-4 py-3">&nbsp;</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <DataTablePagination 
                data={data}
                routeName={routeName}
                queryParams={{
                    search: filters.search,
                    sort: filters.sort,
                    direction: filters.direction,
                }}
            />

            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
                title="Delete Item"
                description={
                    itemToDelete?.title
                        ? `Are you sure you want to delete "${itemToDelete.title}"? This action cannot be undone.`
                        : 'Are you sure you want to delete this item? This action cannot be undone.'
                }
            />
        </div>
    );
} 