import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { type Role, type User } from '@/types/users';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';

interface Props {
    user: User;
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Edit User',
        href: '/users/edit',
    },
];

export default function Edit({ user, roles }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        roles: user.roles.map(role => role.id),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('users.update', user.id));
    };

    const toggleRole = (roleId: number) => {
        const currentRoles = new Set(data.roles);
        if (currentRoles.has(roleId)) {
            currentRoles.delete(roleId);
        } else {
            currentRoles.add(roleId);
        }
        setData('roles', Array.from(currentRoles));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User - ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Leave blank to keep current password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="Leave blank to keep current password"
                                />
                            </div>

                            <div>
                                <Label>Roles</Label>
                                <div className="mt-2 space-y-2">
                                    {roles.map(role => (
                                        <div key={role.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={data.roles.includes(role.id)}
                                                onCheckedChange={() => toggleRole(role.id)}
                                            />
                                            <Label htmlFor={`role-${role.id}`}>{role.name}</Label>
                                        </div>
                                    ))}
                                </div>
                                <InputError message={errors.roles} />
                            </div>

                            <div className="flex justify-end gap-2">
                            <Button type="button" variant="secondary" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Update User
                            </Button>
                        </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 