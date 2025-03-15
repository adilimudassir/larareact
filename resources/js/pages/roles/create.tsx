import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { type Permission } from '@/types/users';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';

interface Props {
    permissions: Permission[];
    models: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Create Role',
        href: '/roles/create',
    },
];

export default function Create({ permissions, models }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    const togglePermission = (permissionId: number) => {
        const currentPermissions = new Set(data.permissions);
        if (currentPermissions.has(permissionId)) {
            currentPermissions.delete(permissionId);
        } else {
            currentPermissions.add(permissionId);
        }
        setData('permissions', Array.from(currentPermissions));
    };

    const toggleModelPermissions = (model: string, action: string) => {
        const modelPermissions = permissions.filter(p => 
            p.name.startsWith(`${model.toLowerCase()}-${action}`)
        );
        const modelPermissionIds = new Set(modelPermissions.map(p => p.id));
        const currentPermissions = new Set(data.permissions);
        
        const hasAllModelPermissions = modelPermissions.every(p => 
            currentPermissions.has(p.id)
        );

        if (hasAllModelPermissions) {
            modelPermissionIds.forEach(id => currentPermissions.delete(id));
        } else {
            modelPermissionIds.forEach(id => currentPermissions.add(id));
        }

        setData('permissions', Array.from(currentPermissions));
    };

    const actions = ['view', 'create', 'update', 'delete'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />

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
                                <Label>Permissions</Label>
                                <div className="mt-4 space-y-6">
                                    {models.map(model => (
                                        <div key={model} className="space-y-2">
                                            <h3 className="font-medium">{model.charAt(0).toUpperCase() + model.slice(1)}</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {actions.map(action => {
                                                    const modelPermissions = permissions.filter(p =>
                                                        p.name.startsWith(`${model.toLowerCase()}-${action}`)
                                                    );
                                                    const hasAllModelPermissions = modelPermissions.every(p =>
                                                        data.permissions.includes(p.id)
                                                    );

                                                    return (
                                                        <div key={`${model}-${action}`} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`${model}-${action}`}
                                                                checked={hasAllModelPermissions}
                                                                onCheckedChange={() => toggleModelPermissions(model, action)}
                                                            />
                                                            <Label htmlFor={`${model}-${action}`}>
                                                                {action.charAt(0).toUpperCase() + action.slice(1)}
                                                            </Label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <InputError message={errors.permissions} />
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="secondary" onClick={() => window.history.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Create Role
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 