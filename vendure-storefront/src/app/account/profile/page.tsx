import type {Metadata} from 'next';
import { getActiveCustomer } from '@/lib/vendure/actions';

export const metadata: Metadata = {
    title: 'Perfil',
};
import { ChangePasswordForm } from './change-password-form';
import { EditProfileForm } from './edit-profile-form';
import { EditEmailForm } from './edit-email-form';

export default async function ProfilePage(_props: PageProps<'/account/profile'>) {
    const customer = await getActiveCustomer();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Perfil</h1>
                <p className="text-muted-foreground mt-2">
                    Gerenciar informações da sua conta
                </p>
            </div>

            <EditProfileForm customer={customer} />

            <EditEmailForm currentEmail={customer?.emailAddress || ''} />

            <ChangePasswordForm />
        </div>
    );
}
