import React, { useState, useEffect } from 'react';
import { Card, Container, Spinner } from 'react-bootstrap';
import { Device, DeviceType } from '../../types/DeviceInfoTypes';
import DeviceItem from './DeviceItem';
import ActionButtons from '../ActionButtons';

interface DevicesFormProps {
    devices: Device[];
    onChange: (devices: Device[]) => void;
    onBack: () => void;
    onNext: () => void;
    shouldHighlightError: (field: string, value: any) => boolean;
    markFieldAsTouched: (field: string) => void;
    validateStep: () => boolean;
}

// Функция для симуляции запроса к серверу для получения списка устройств
const fetchDevices = async (): Promise<Device[]> => {
    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Возвращаем примерные данные
    return [
        {
            mavlinkSysId: 'SYS_001',
            deviceType: DeviceType.ORKAN,
            onboardVideos: [],
            parametersFiles: [],
        },
        {
            mavlinkSysId: 'SYS_002',
            deviceType: DeviceType.ORKAN,
            onboardVideos: [],
            parametersFiles: [],
        },
        {
            mavlinkSysId: 'SYS_003',
            deviceType: DeviceType.ORKAN,
            onboardVideos: [],
            parametersFiles: [],
        },
    ];
};

const DevicesForm: React.FC<DevicesFormProps> = ({
    devices,
    onChange,
    onBack,
    onNext,
    shouldHighlightError,
    markFieldAsTouched,
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Загрузка данных при монтировании компонента
    useEffect(() => {
        const loadDevices = async () => {
            try {
                setLoading(true);
                const devicesData = await fetchDevices();
                onChange(devicesData);
                setError(null);
            } catch (err) {
                console.error('Ошибка загрузки устройств:', err);
                setError('Не удалось загрузить список устройств');
            } finally {
                setLoading(false);
            }
        };

        // Загружаем только если devices пуст (первый рендер)
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
                <button
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                >
                    Повторить попытку
                </button>
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
                <ActionButtons onBack={onBack} onNext={onNext} />
            </Card>
        </Container>
    );
};

export default DevicesForm;