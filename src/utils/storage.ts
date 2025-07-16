// type StorageKey = 'experimentForm'

export const safeGet = <T>(key: string): T | null => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};


export const checkStorageLimit = (data: unknown, margin = 50000): boolean => {
    try {
        const testData = JSON.stringify(data);
        return testData.length + margin < 5 * 1024 * 1024;
    } catch (e) {
        console.error('Превышен лимит localStorage:', e);
        return false;
    }
};


export const safeSet = (key: string, value: unknown): boolean => {
    if (typeof window === 'undefined') return false;

    if (!checkStorageLimit(value)) {
        alert('Локальное хранилище переполнено. Данные не будут сохранены.');
        return false;
    }

    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Ошибка записи:', error);
        return false;
    }
};


export const getCurrentStep = (): number => {
    return safeGet<number>('currentStep') ?? 1;
}

export const setCurrentStep = (step: number): boolean => {
    return safeSet('currentStep', step);
}