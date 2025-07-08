import { UploadingFile } from './types/LogsUploadTypes';
import { SelectItem } from './types/ExperimentInfoTypes';
import { Device, DeviceType } from './types/DeviceInfoTypes';
import { Event } from './types/EventInfoTypes';
import { AdditionalFile } from './types/OtherFilesTypes';

const API_BASE_URL = 'http://10.200.10.219:5000';

export const postLogsUpload = async (
    files: UploadingFile[],
    experimentId?: number
) => {
    if (!experimentId) throw new Error('ExperimentId is required');

    const formData = new FormData();
    files.forEach((file) => {
        if (file.file) {
            formData.append('file', file.file);
        }
    });
    formData.append('experiment_id', experimentId.toString());

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
            label: item.location_name,
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
            throw new Error(
                `Failed to fetch operators: ${response.status} ${response.statusText}`
            );
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
    operators?: SelectItem[];
    selectedLocation?: SelectItem | null;
}) => {
    const errors = [];
    if (!data.reportFile) errors.push('Файл отчёта');
    if (!data.recordCreator?.id) errors.push('Создатель записи');
    if (!data.responsibleOperator?.id) errors.push('Ответственный оператор');
    if (!data.description?.trim()) errors.push('Описание');
    if (!data.experimentDate) errors.push('Дата эксперимента');
    if (!data.selectedLocation?.id) errors.push('Локация');
    if (!data.operators || data.operators.length === 0) {
        errors.push('Операторы');
    }

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

        const responseData = await response.json();
        const experimentId = responseData.experiment_id;

        console.log('Эксперимент создан, ID: ', responseData.experiment_id);

        const operatorsResponse = await fetch(
            `${API_BASE_URL}/experiment-operators`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    experiment_id: experimentId,
                    operator_ids: data.operators?.map((op) => op.id) || [],
                }),
            }
        );
        if (!operatorsResponse.ok) {
            throw new Error('Ошибка сохранения операторов эксперимента');
        }
        console.log('experiment_operators создан');

        const locationResponse = await fetch(
            `${API_BASE_URL}/experiment-locations`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    experiment_id: experimentId,
                    location_id: data.selectedLocation?.id,
                }),
            }
        );
        if (!locationResponse.ok) {
            throw new Error('Ошибка сохранения локации эксперимента');
        }
        console.log('experiment_location создан');

        return experimentId;
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

        if (
            !data?.mavlink_system_id ||
            !Array.isArray(data.mavlink_system_id)
        ) {
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

export const saveDevicesInfo = async (
    devices: Device[],
    experimentId?: number
) => {
    try {
        if (!experimentId) throw new Error('ExperimentId is required');

        const deviceResponses = await Promise.all(
            devices.map(async (device) => {
                const deviceResponse = await fetch(`${API_BASE_URL}/devices`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        device_type: device.deviceType,
                        mavlink_system_id: device.mavlinkSysId,
                    }),
                });

                if (!deviceResponse.ok) {
                    throw new Error('Ошибка сохранения device type и sys_id');
                }
                console.log('Успешная отправка device type и sys_id');
                const deviceData = await deviceResponse.json();

                const experimentDeviceData = new FormData();
                experimentDeviceData.append(
                    'experiment_id',
                    experimentId.toString()
                );
                experimentDeviceData.append('device_id', deviceData.device_id);

                const experimentDeviceResponse = await fetch(
                    `${API_BASE_URL}/experiment-device`,
                    {
                        method: 'POST',
                        body: experimentDeviceData,
                    }
                );

                if (device.onboardVideos.length > 0) {
                    const videoFormData = new FormData();
                    device.onboardVideos.forEach((file) => {
                        videoFormData.append('file', file);
                        videoFormData.append('device_id', deviceData.device_id);
                        videoFormData.append(
                            'experiment_id',
                            experimentId.toString()
                        );
                    });

                    const videoResponse = await fetch(
                        `${API_BASE_URL}/device-records`,
                        {
                            method: 'POST',
                            body: videoFormData,
                        }
                    );

                    if (!videoResponse.ok) {
                        throw new Error('Ошибка сохранения видео');
                    }
                    console.log('Успешная отправка видео с борта аппарата');
                } else {
                    console.log('Нет добавленных видео');
                }

                if (device.parametersFiles.length > 0) {
                    const paramsFormData = new FormData();
                    device.parametersFiles.forEach((file) => {
                        paramsFormData.append('file', file);
                        paramsFormData.append(
                            'device_id',
                            deviceData.device_id
                        );
                        paramsFormData.append(
                            'experiment_id',
                            experimentId.toString()
                        );
                    });

                    const paramsResponse = await fetch(
                        `${API_BASE_URL}/device-parameters`,
                        {
                            method: 'POST',
                            body: paramsFormData,
                        }
                    );

                    if (!paramsResponse.ok) {
                        throw new Error('Ошибка сохранения параметров');
                    }
                    console.log('Успешная отправка файлов аппарата');
                } else {
                    console.log('Нет добавленных параметров');
                }

                return {
                    device_id: deviceData.device_id,
                    mavlink_system_id: device.mavlinkSysId
                };
            })
        );

        return deviceResponses;
    } catch (error) {
        console.error('Ошибка сохранения устройств:', error);
        throw error;
    }
};

export const findDeviceByExperimentAndMavlink = async (
    experimentId: number,
    mavlinkSysId: number
): Promise<{ device_id: number; device_type: string } | null> => {
    try {
        const params = new URLSearchParams({
            experiment_id: experimentId.toString(),
            mavlink_system_id: mavlinkSysId.toString()
        });

        const response = await fetch(
            `${API_BASE_URL}/find-by-experiment-and-mavlink?${params}`
        );

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            return {
                device_id: data.device_id,
                device_type: data.device_type
            };
        } else {
            console.error('Устройство не найдено:', data.message);
            return null;
        }

    } catch (error) {
        console.error('Ошибка поиска устройства:', error);
        return null;
    }
};

export const saveEventInfo = async (events: Event[], experimentId?: number) => {
    try {
        if (!experimentId) throw new Error('ExperimentId is required');

        const eventResponses = await Promise.all(
            events.map(async (event) => {
                // 1. Сначала сохраняем основную информацию о событии
                const eventResponse = await fetch(`${API_BASE_URL}/events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        description: event.description,
                        event_time: event.time,
                        experiment_id: experimentId,
                    }),
                });

                if (!eventResponse.ok) {
                    throw new Error('Ошибка сохранения события');
                }

                const responseData = await eventResponse.json();
                console.log('Успешная отправка времени события и его описания');

                // 2. Обрабатываем привязку устройств, если они есть
                if (event.deviceIds && event.deviceIds.length > 0) {
                    await Promise.all(
                        event.deviceIds.map(async (mavlinkSysIdStr) => {
                            try {
                                const mavlinkSysId = Number(mavlinkSysIdStr);
                                // 3. Находим device_id по mavlink_system_id и experiment_id
                                const deviceInfo = await findDeviceByExperimentAndMavlink(
                                    experimentId,
                                    Number(mavlinkSysId)
                                );

                                if (!deviceInfo) {
                                    throw new Error(`Устройство с MAVLink ID ${mavlinkSysId} не найдено в эксперименте`);
                                }

                                // 4. Сохраняем связь события с устройством
                                const eventDeviceResponse = await fetch(
                                    `${API_BASE_URL}/event-devices`,
                                    {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            event_id: responseData.event_id,
                                            device_id: deviceInfo.device_id,
                                        }),
                                    }
                                );

                                if (!eventDeviceResponse.ok) {
                                    throw new Error(
                                        'Ошибка сохранения связи события с устройством'
                                    );
                                }

                                console.log(
                                    `Успешная привязка события к устройству (MAVLink ID: ${mavlinkSysId}, device_id: ${deviceInfo.device_id})`
                                );
                            } catch (error) {
                                console.error(
                                    `Ошибка при обработке устройства с MAVLink ID ${mavlinkSysIdStr}:`,
                                    error
                                );
                                throw error; // Пробрасываем ошибку дальше
                            }
                        })
                    );
                }

                return responseData;
            })
        );
        return eventResponses;
    } catch (error) {
        console.error('Ошибка сохранения данных о событиях:', error);
        throw error;
    }
};

export const saveOtherFiles = async (
    data: {
        screenshots: AdditionalFile[];
        screenRecordings: (File | null)[];
        additionalAttachments: (File | null)[];
    },
    experimentId?: number
) => {
    if (!experimentId) throw new Error('ExperimentId is required');

    try {
        const screenshotResults = await Promise.all(
            data.screenshots.map(async (screenshot) => {
                if (!screenshot.file) {
                    console.log('Нет добавленных скриншотов');
                    return true;
                }

                const formData = new FormData();
                formData.append('file', screenshot.file);
                formData.append('description', screenshot.description);
                formData.append('experiment_id', experimentId?.toString());

                const response = await fetch(
                    `${API_BASE_URL}/experiment_screenshots`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (!response.ok) {
                    console.error(
                        'Ошибка при загрузке скриншота',
                        await response.text()
                    );
                    return false;
                }
                console.log('Успешная отправка скриншота');
                return true;
            })
        );

        // Обработка записей экрана
        const recordingResults = await Promise.all(
            data.screenRecordings.map(async (recording) => {
                if (!recording) {
                    console.log('Нет добавленных записей экрана');
                    return true;
                }

                const formData = new FormData();
                formData.append('file', recording);
                formData.append('experiment_id', experimentId?.toString());

                const response = await fetch(
                    `${API_BASE_URL}/experiment_recordings`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (!response.ok) {
                    console.error(
                        'Ошибк при загрузке записи экрана',
                        await response.text()
                    );
                    return false;
                }
                console.log('Успешная отправка записи экрана');
                return true;
            })
        );

        // Обработка вложений
        const attachmentResults = await Promise.all(
            data.additionalAttachments.map(async (attachment) => {
                if (!attachment) {
                    console.log('Нет добавленных вложений');
                    return true;
                }

                const formData = new FormData();
                formData.append('file', attachment);
                formData.append('experiment_id', experimentId?.toString());

                const response = await fetch(
                    `${API_BASE_URL}/experiment_attachments`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (!response.ok) {
                    console.error(
                        'Ошибк при загрузке вложений',
                        await response.text()
                    );
                    return false;
                }
                console.log('Успешная отправка дополнительного вложения');
                return true;
            })
        );

        // Проверяем, что все загрузки прошли успешно
        return (
            screenshotResults.every(Boolean) &&
            recordingResults.every(Boolean) &&
            attachmentResults.every(Boolean)
        );
    } catch (error) {
        console.error('Error submitting files:', error);
        return false;
    }
};
