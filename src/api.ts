import { UploadFile } from './types/LogsUploadTypes';
import { SelectItem } from './types/ExperimentInfoTypes'
const API_BASE_URL = 'http://127.0.0.1:5000';

export const fetchLogsUpload = async (files: UploadFile[]) => {
    try {
        const formData = new FormData();
        files.forEach((file) => {
            // Предполагается, что file содержит объект File (из input type="file")
            if (file.file) {
                // Добавьте поле file в интерфейс UploadFile, если его нет
                formData.append('tlog_files', file.file);
            }
        });

        const response = await fetch(`${API_BASE_URL}/logs`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Ошибка при загрузке файлов');
        }

        const result = await response.json();
        console.log('Файлы успешно загружены:', result);
        return result;
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
};

export const fetchLocations = async (): Promise<SelectItem[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/locations`);
        if (!response.ok) {
            throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        return data.map((item: any) => ({
            id: item.id,
            label: item.name // или другое поле, в зависимости от структуры ответа
        }));
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
};

export const fetchOperators = async (): Promise<SelectItem[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/operators`);
        if (!response.ok) {
            throw new Error('Failed to fetch operators');
        }
        const data = await response.json();
        return data.map((item: any) => ({
            id: item.id,
            label: `${item.last_name} ${item.first_name[0]}.${item.middle_name ? ` ${item.middle_name[0]}.` : ''}`
        }));
    } catch (error) {
        console.error('Error fetching operators:', error);
        throw error;
    }
};
