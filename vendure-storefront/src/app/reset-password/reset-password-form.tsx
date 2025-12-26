'use client';

import { use, useActionState } from 'react';
import { resetPasswordAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface ResetPasswordFormProps {
    searchParams: Promise<{ token?: string }>;
}

export function ResetPasswordForm({ searchParams }: ResetPasswordFormProps) {
    const params = use(searchParams);
    const token = params.token || null;

    const [state, formAction, isPending] = useActionState(resetPasswordAction, undefined);

    if (!token) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Link de redefinição inválido</CardTitle>
                    <CardDescription>
                        O link de redefinição de senha é inválido ou expirou.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Link href="/forgot-password">
                        <Button variant="outline" className="w-full">
                            Solicitar um novo link de redefinição
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Redefinir sua senha</CardTitle>
                <CardDescription>
                    Digite sua nova senha abaixo.
                </CardDescription>
            </CardHeader>
            <form action={formAction}>
                <input type="hidden" name="token" value={token} />
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Nova Senha</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            disabled={isPending}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            required
                            disabled={isPending}
                        />
                    </div>
                    {state?.error && (
                        <div className="text-sm text-destructive">
                            {state.error}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? 'Redefinindo senha...' : 'Redefinir senha'}
                    </Button>
                    <Link
                        href="/sign-in"
                        className="text-sm text-center text-muted-foreground hover:text-primary"
                    >
                        Voltar ao Login
                    </Link>
                </CardFooter>
            </form>
        </Card>
    );
}
