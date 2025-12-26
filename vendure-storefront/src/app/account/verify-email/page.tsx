import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { mutate } from '@/lib/vendure/api';
import { UpdateCustomerEmailAddressMutation } from '@/lib/vendure/mutations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function VerifyEmailContent({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {
    const resolvedParams = await searchParams;
    const tokenParam = resolvedParams.token;
    const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

    if (!token) {
        return (
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Link de Verificação Inválido</CardTitle>
                    <CardDescription>
                        O link de verificação está faltando ou é inválido.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Por favor, verifique seu e-mail para o link de verificação correto ou solicite um novo na página do seu perfil.
                    </p>
                    <Button asChild>
                        <Link href="/account/profile">Ir para Perfil</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    try {
        const result = await mutate(UpdateCustomerEmailAddressMutation, { token: token! }, { useAuthToken: true });
        const updateResult = result.data.updateCustomerEmailAddress;

        if (updateResult.__typename === 'Success') {
            return (
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>E-mail Verificado!</CardTitle>
                        <CardDescription>
                            Seu endereço de e-mail foi atualizado com sucesso.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Seu endereço de e-mail foi alterado. Agora você pode usar seu novo endereço de e-mail para fazer login.
                        </p>
                        <Button asChild>
                            <Link href="/account/profile">Ir para Perfil</Link>
                        </Button>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Falha na Verificação</CardTitle>
                    <CardDescription>
                        {updateResult.message || 'Não foi possível verificar seu endereço de e-mail.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        O link de verificação pode ter expirado ou já foi utilizado. Por favor, solicite um novo e-mail de verificação na página do seu perfil.
                    </p>
                    <Button asChild>
                        <Link href="/account/profile">Ir para Perfil</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    } catch (error) {
        return (
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Erro na Verificação</CardTitle>
                    <CardDescription>
                        Ocorreu um erro inesperado durante a verificação.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Por favor, tente novamente mais tarde ou entre em contato com o suporte se o problema persistir.
                    </p>
                    <Button asChild>
                        <Link href="/account/profile">Ir para Perfil</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }
}

export default async function VerifyEmailPage({searchParams}: PageProps<'/account/verify-email'>) {
    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            <Suspense fallback={
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Verificando E-mail...</CardTitle>
                        <CardDescription>
                            Por favor, aguarde enquanto verificamos seu endereço de e-mail.
                        </CardDescription>
                    </CardHeader>
                </Card>
            }>
                <VerifyEmailContent searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
