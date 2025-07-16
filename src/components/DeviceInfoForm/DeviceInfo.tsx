import React, { useState, useEffect } from 'react';
import { Card, Container, Spinner, Button } from 'react-bootstrap';
import { Device } from '../../types/DeviceInfoTypes';
import DeviceItem from './DeviceItem';
import { getDevices, saveDevicesInfo } from '../../api';
import { DevicesFormProps } from '../../types/DeviceInfoTypes';
import { handleCancelWithDelete } from '../../utils/handleCancel';

const DevicesInfo: React.FC<DevicesFormProps> = ({
    experimentId,
    devices,
    onChange,
    onBack,
    onNext,
    shouldHighlightError,
    markFieldAsTouched,
    validateStep,
    onDeleteExperiment, // Принимаем функцию удаления
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadDevices = async () => {
            if (!experimentId) {
                setError('Experiment ID is missing');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const devicesData = await getDevices(experimentId);

                const uniqueDevices = devicesData.filter(
                    (device, index, self) =>
                        index ===
                        self.findIndex(
                            (d) => d.mavlinkSysId === device.mavlinkSysId
                        )
                );

                const currentIds = devices.map((d) => d.mavlinkSysId);
                const newIds = uniqueDevices.map((d) => d.mavlinkSysId);

                if (
                    currentIds.length !== newIds.length ||
                    !currentIds.every((id) => newIds.includes(id))
                ) {
                    onChange(uniqueDevices);
                }

                setError(null);
            } catch (err) {
                setError('Failed to load devices');
                console.error('Device loading error:', err);
            } finally {
                setLoading(false);
            }
        };

        loadDevices();
    }, [experimentId]);

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
                        variant="danger"
                        onClick={() =>
                            handleCancelWithDelete(
                                experimentId,
                                onDeleteExperiment
                            )
                        }
                        disabled={isSubmitting}
                        size="lg"
                    >
                        Отменить
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
