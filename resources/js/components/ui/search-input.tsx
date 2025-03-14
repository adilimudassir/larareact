import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
    const [localValue, setLocalValue] = useState(value);

    const debouncedOnChange = useCallback(
        debounce((value: string) => {
            onChange(value);
        }, 300),
        []
    );

    const handleChange = (value: string) => {
        setLocalValue(value);
        debouncedOnChange(value);
    };

    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
                type="search"
                placeholder="Search todos..."
                value={localValue}
                onChange={(e) => handleChange(e.target.value)}
                className="pl-9"
            />
        </div>
    );
} 