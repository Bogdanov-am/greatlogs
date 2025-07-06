import { UploadingFile } from './types/LogsUploadTypes';
import { SelectItem } from './types/ExperimentInfoTypes';
import { Device, DeviceType } from './types/DeviceInfoTypes';
import { Event } from './types/EventInfoTypes';

const API_BASE_URL = 'http://10.200.10.219:5000';

export const postLogsUpload = async (files: UploadingFile[]) => {
    const formData = new FormData();
    files.forEach((file) => {
        if (file.file) {
            formData.append('file', file.file);
        }
    });

    const response = await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Ошибка при загрузке файлов');
    }
    console.log('Лог отправелен');
    return await response.json();
};

export const getLocations = async (): Promise<SelectItem[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/locations`);
        if (!response.ok) {
            throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        return data.map((item: any) => ({
            id: item.location_id,
            label: item.location_name, // или другое поле, в зависимости от структуры ответа
        }));
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
};



export const getOperators = async (): Promise<SelectItem[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/operators`);
        if (!response.ok) {
            throw new Error(`Failed to fetch operators: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Валидация структуры ответа
        if (!Array.isArray(data)) {
            throw new Error('Invalid operators data format: expected array');
        }

        // Обработка и проверка данных
        const operators: SelectItem[] = [];
        const idSet = new Set();

        for (const item of data) {
            // Проверка обязательных полей
            if (!item.operator_id && !item.operators_id) {
                console.warn('Operator missing ID field:', item);
                continue;
            }
            
            const id = item.operator_id || item.operators_id;
            const name = item.operator_name || 'Unknown';
            
            // Проверка на дубликаты
            if (idSet.has(id)) {
                console.warn(`Duplicate operator ID: ${id}`, item);
                continue;
            }
            
            idSet.add(id);
            operators.push({
                id,
                label: name,
            });
        }

        if (operators.length === 0) {
            console.warn('No valid operators found in response');
        }

        return operators;
    } catch (error) {
        console.error('Error fetching operators:', error);
        throw error;
    }
};



export const saveExperimentInfo = async (data: {
    experimentDate: string;
    description: string;
    reportFile: File | null;
    responsibleOperator: SelectItem | null;
    recordCreator: SelectItem | null;
}) => {

    const errors = [];
    if (!data.reportFile) errors.push('Файл отчёта');
    if (!data.recordCreator?.id) errors.push('Создатель записи');
    if (!data.responsibleOperator?.id) errors.push('Ответственный оператор');
    if (!data.description?.trim()) errors.push('Описание');
    if (!data.experimentDate) errors.push('Дата эксперимента');
    
    if (errors.length > 0) {
        throw new Error(`Заполните обязательные поля: ${errors.join(', ')}`);
    }

    const formData = new FormData();

    formData.append('file', data.reportFile!);
    formData.append('creator', data.recordCreator!.id.toString());
    formData.append('responsible', data.responsibleOperator!.id.toString());
    formData.append('description', data.description);
    formData.append('created_date', data.experimentDate);

    try {
        const response = await fetch(`${API_BASE_URL}/experiments`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Полный ответ сервера:', errorText);
            throw new Error(errorText || 'Неизвестная ошибка сервера');            
        }
        console.log('Успешная отправка ExperimentInfo');
        return await response.json();
    } catch (error) {
        console.error('Полная ошибка API:', error);
        throw error;
    }
};


export const getMavlinkSysIds = async (): Promise<Device[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/devices`);

        if (!response.ok) {
            throw new Error('Ошибка получения данных устройств');
        }        
        const data = await response.json();
        
        if (!data?.mavlink_system_id || !Array.isArray(data.mavlink_system_id)) {
            console.error('Неверный формат данных:', data);
            return [];
        }
        console.log('Список аппаратов получен');
        return data.mavlink_system_id.map((sys_id: number) => ({
            mavlinkSysId: sys_id.toString(),
            deviceType: DeviceType.ORKAN,
            onboardVideos: [],
            parametersFiles: [],
        }));
    } catch (error) {
        console.error('Ошибка API:', error);
        return [];
    }
};


export const saveDevicesInfo = async (devices: Device[]) => {
    try {
        const deviceResponses = await Promise.all(
            devices.map(async (device) => {                
                const deviceResponse = await fetch(`${API_BASE_URL}/devices`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        device_type: device.deviceType,
                        mavlink_system_id: device.mavlinkSysId
                    }),
                });

                if (!deviceResponse.ok) {
                    throw new Error('Ошибка сохранения device type и sys_id');
                }
                console.log('Успешная отправка device type и sys_id')

                const deviceData = await deviceResponse.json();

                if (device.onboardVideos.length > 0) {
                    const videoFormData = new FormData();
                    device.onboardVideos.forEach(file => {
                        videoFormData.append('file', file);
                    });


                    const videoResponse = await fetch(`${API_BASE_URL}/device-records`, {
                        method: 'POST',
                        body: videoFormData,
                    });

                    if (!videoResponse.ok) {
                        throw new Error('Ошибка сохранения видео');
                    }
                    console.log('Успешная отправка видео с борта аппарата')
                } else {
                    console.log("Нет добавленных видео")
                }

                if (device.parametersFiles.length > 0) {
                    const paramsFormData = new FormData();
                    device.parametersFiles.forEach(file => {
                        paramsFormData.append('file', file);
                    });

                    const paramsResponse = await fetch(`${API_BASE_URL}/device-parameters`, {
                        method: 'POST',
                        body: paramsFormData,
                    });

                    if (!paramsResponse.ok) {
                        throw new Error('Ошибка сохранения параметров');
                    }
                    console.log('Успешная отправка файлов аппарата')
                } else {
                    console.log("Нет добавленных параметров")
                }

                return deviceData;
            })
        );

        return deviceResponses;
    } catch (error) {
        console.error('Ошибка сохранения устройств:', error);
        throw error;
    }
};


export const saveEventInfo = async (events: Event[]) => {
    try {
        const eventResponses = await Promise.all(
            events.map(async (event) => {
            const eventResponse = await fetch(`${API_BASE_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: event.description,
                    event_time: event.time
                }),
            });
            const responseData = await eventResponse.json();

            if (!eventResponse.ok) {
                throw new Error('Ошибка сохранения события');
            }
            console.log('Успешная отправка данных о событии')
            return responseData
        }));
    return eventResponses;
    } catch (error) {
        console.error('Ошибка дынных о собтиях:', error);
        throw error;
    }
}