import React, { useState, useEffect } from 'react';
import { Card, Container, Spinner, Button } from 'react-bootstrap';
import { Device } from '../../types/DeviceInfoTypes';
import DeviceItem from './DeviceItem';
import { getMavlinkSysIds, saveDevicesInfo } from '../../api'; // Добавляем новый метод API
import { DevicesFormProps } from '../../types/DeviceInfoTypes';

const DevicesInfo: React.FC<DevicesFormProps> = ({
    experimentId,
    devices,
    onChange,
    onBack,
    onNext,
    shouldHighlightError,
    markFieldAsTouched,
    validateStep,
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadDevices = async () => {
            try {
                setLoading(true);
                const devicesData = await getMavlinkSysIds();
                onChange(devicesData);
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить список устройств');
            } finally {
                setLoading(false);
            }
        };

        if (devices.length === 0) {
            loadDevices();
        } else {
            setLoading(false);
        }
    }, []);

    const updateDevice = (index: number, device: Device) => {
        const newDevices = [...devices];
        newDevices[index] = device;
        onChange(newDevices);
    };

    const handleNextWithSave = async () => {
        setIsSubmitting(true);

        try {
            // Помечаем все поля как "тронутые" для валидации
            devices.forEach((_, deviceIndex) => {
                markFieldAsTouched(`devices[${deviceIndex}].deviceType`);
                markFieldAsTouched(`devices[${deviceIndex}].onboardVideos`);
                markFieldAsTouched(`devices[${deviceIndex}].parametersFiles`);
            });

            // Проверяем валидность данных
            if (!validateStep()) {
                throw new Error(
                    'Заполните все обязательные поля для каждого устройства'
                );
            }

            // Сохраняем данные устройств
            await saveDevicesInfo(devices, experimentId);
            onNext();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert(
                error instanceof Error
                    ? error.message
                    : 'Ошибка сохранения устройств'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container className="text-center my-4">
                <Spinner animation="border" variant="primary" />
                <p>Загрузка списка устройств...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center my-4">
                <div className="alert alert-danger">{error}</div>
                <div className="d-flex justify-content-between">
                    <Button
                        variant="outline-secondary"
                        onClick={onBack}
                        disabled={isSubmitting}
                    >
                        Назад
                    </Button>
                    <Button
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                    >
                        Повторить попытку
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <h2 className="mb-4">Аппараты</h2>
            <Card className="p-4">
                <div className="mb-4">
                    {devices.map((device, index) => (
                        <DeviceItem
                            key={device.mavlinkSysId}
                            device={device}
                            onChange={(updatedDevice) =>
                                updateDevice(index, updatedDevice)
                            }
                            shouldHighlightError={shouldHighlightError}
                            markFieldAsTouched={markFieldAsTouched}
                        />
                    ))}
                </div>
                <div className="d-flex justify-content-between">
                    <Button
                        variant="outline-secondary"
                        onClick={onBack}
                        disabled={isSubmitting}
                        size="lg"
                    >
                        Назад
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleNextWithSave}
                        disabled={isSubmitting}
                        size="lg"
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <span className="ms-2">Сохранение...</span>
                            </>
                        ) : (
                            'Далее'
                        )}
                    </Button>
                </div>
            </Card>
        </Container>
    );
};

export default DevicesInfo;
