import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthLayout({ children, title, description, ...props }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
