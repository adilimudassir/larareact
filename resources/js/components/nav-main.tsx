import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavMainProps {
    items: (NavItem | NavGroup)[];
}

export function NavMain({ items = [] }: NavMainProps) {
    const page = usePage();

    const renderNavItem = (item: NavItem) => (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.href === page.url}>
                <Link href={item.href} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );

    const renderNavGroup = (group: NavGroup) => (
        <SidebarGroup key={group.title} className="px-2 py-2">
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
                {group.items.map(renderNavItem)}
            </SidebarMenu>
        </SidebarGroup>
    );

    return (
        <>
            {items.map((item) => (
                'items' in item ? renderNavGroup(item) : renderNavItem(item)
            ))}
        </>
    );
}
