import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PermissionGuard } from '@/components/permission-guard';

interface NavMainProps {
    items: (NavItem | NavGroup)[];
}

export function NavMain({ items = [] }: NavMainProps) {
    const page = usePage();

    const renderNavItem = (item: NavItem) => {
        const content = (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={item.href === page.url}>
                    <Link href={item.href} prefetch>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );

        if (item.permission) {
            return (
                <PermissionGuard key={item.title} permission={item.permission}>
                    {content}
                </PermissionGuard>
            );
        }

        return content;
    };

    const renderNavGroup = (group: NavGroup) => {
        const items = group.items.filter(item => !item.permission);
        const permissionItems = group.items.filter(item => item.permission);

        return (
            <SidebarGroup key={group.title} className="px-2 py-2">
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarMenu>
                    {items.map(renderNavItem)}
                    {permissionItems.map(renderNavItem)}
                </SidebarMenu>
            </SidebarGroup>
        );
    };

    return (
        <>
            {items.map((item) => (
                'items' in item ? renderNavGroup(item) : renderNavItem(item)
            ))}
        </>
    );
}
