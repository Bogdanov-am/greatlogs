import { useEffect, useState } from 'react';
import { safeSet, safeGet } from '../utils/storage';

export const usePersistForm = <T extends object>(
    key: string,
    initialData: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [data, setData] = useState<T>(() => {
        const saved = safeGet<T>(key);
        return saved ?? initialData;
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            safeSet(key, data);
        }, 1000);

        return () => clearTimeout(timer);
    }, [data, key]);

    return [data, setData];
};
