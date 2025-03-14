import { Link } from '@inertiajs/react';
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export function Pagination({ links }: PaginationProps) {
    return (
        <div className="flex items-center justify-center gap-2">
            {links.map((link, i) => {
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
                            className={!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                            asChild={link.url ? true : false}
                            disabled={!link.url}
                        >
                            {link.url ? (
                                <Link href={link.url}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            ) : (
                                <ChevronLeft className="h-4 w-4" />
                            )}
                        </Button>
                    );
                }

                if (i === links.length - 1) {
                    return (
                        <Button
                            key={link.label}
                            variant="outline"
                            size="sm"
                            className={!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                            asChild={link.url ? true : false}
                            disabled={!link.url}
                        >
                            {link.url ? (
                                <Link href={link.url}>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    );
                }

                return (
                    <Button
                        key={link.label}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        className="min-w-[2.25rem]"
                        asChild={!link.active && link.url ? true : false}
                    >
                        {link.url && !link.active ? (
                            <Link href={link.url}>
                                {link.label}
                            </Link>
                        ) : (
                            link.label
                        )}
                    </Button>
                );
            })}
        </div>
    );
} 