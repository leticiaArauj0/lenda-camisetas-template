import type {Metadata} from 'next';
import { query } from '@/lib/vendure/api';

export const metadata: Metadata = {
    title: 'Endereços',
};
import { GetCustomerAddressesQuery, GetAvailableCountriesQuery } from '@/lib/vendure/queries';
import { AddressesClient } from './addresses-client';

export default async function AddressesPage(_props: PageProps<'/account/addresses'>) {
    const [addressesResult, countriesResult] = await Promise.all([
        query(GetCustomerAddressesQuery, {}, { useAuthToken: true }),
        query(GetAvailableCountriesQuery, {}),
    ]);

    const addresses = addressesResult.data.activeCustomer?.addresses || [];
    const countries = countriesResult.data.availableCountries || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Endereços</h1>
                <p className="text-muted-foreground mt-2">
                    Gerencie seus endereços de envio e cobrança salvos
                </p>
            </div>

            <AddressesClient addresses={addresses} countries={countries} />
        </div>
    );
}
