import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';

export default function ProfileLoading() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Perfil</h1>
                <p className="text-muted-foreground mt-2">
                    Gerenciar informações da sua conta
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informações da Conta</CardTitle>
                    <CardDescription>
                        Seus dados pessoais
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm font-medium">Email</p>
                        <Skeleton className="h-4 w-48 mt-1"/>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Nome</p>
                        <Skeleton className="h-4 w-32 mt-1"/>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Alterar Senha</CardTitle>
                    <CardDescription>
                        Atualize sua senha
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32"/>
                        <Skeleton className="h-10 w-full"/>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32"/>
                        <Skeleton className="h-10 w-full"/>
                    </div>
                    <Skeleton className="h-10 w-32"/>
                </CardContent>
            </Card>
        </div>
    );
}
