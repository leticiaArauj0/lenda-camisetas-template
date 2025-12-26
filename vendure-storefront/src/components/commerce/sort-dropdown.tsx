'use client';


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {usePathname, useRouter, useSearchParams} from "next/navigation";

const sortOptions = [
    {value: 'name-asc', label: 'Nome: A a Z'},
    {value: 'name-desc', label: 'Nome: Z a A'},
    {value: 'price-asc', label: 'Menor Preço'},
    {value: 'price-desc', label: 'Maior Preço'},
];

export function SortDropdown() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentSort = searchParams.get('sort') || 'name-asc';

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', value);
        params.delete('page'); // Reset to page 1 when sort changes
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por"/>
            </SelectTrigger>
            <SelectContent>
                {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
