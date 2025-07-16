import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { Device, DeviceType } from '../../types/DeviceInfoTypes';

interface DeviceFormFieldsProps {
    device: Device;
    onChange: (device: Device) => void;
    shouldHighlightError: (fieldName: string, value: any) => boolean;
    handleBlur: (fieldName: string) => void;
}

const DeviceFormFields: React.FC<DeviceFormFieldsProps> = ({
    device,
    onChange,
    shouldHighlightError,
    handleBlur,
}) => {
    const [isInitialZero, setIsInitialZero] = useState(
        device.serialNumber === 0
    );

    const handleSerialNumberChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        // Разрешаем пустую строку или число
        if (value === '' || /^\d+$/.test(value)) {
            onChange({
                ...device,
                serialNumber: value === '' ? 0 : parseInt(value, 10),
            });
        }
    };

    return (
        <Row>
            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        <h6>MAVLink SYS_ID</h6>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        value={device.mavlinkSysId}
                        readOnly
                        plaintext
                        className="form-control-plaintext"
                    />
                </Form.Group>
            </Col>

            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        <h6>Серийный номер</h6>
                    </Form.Label>
                    {isInitialZero ? (
                        <Form.Control
                            type="text"
                            value={
                                device.serialNumber === 0
                                    ? ''
                                    : device.serialNumber.toString()
                            }
                            onChange={handleSerialNumberChange}
                            onBlur={() => handleBlur('serialNumber')}
                            size="sm"
                            pattern="\d*"
                            placeholder="Введите серийный номер"
                        />
                    ) : (
                        <Form.Control
                            type="text"
                            value={device.serialNumber.toString()}
                            readOnly
                            plaintext
                            className="form-control-plaintext"
                        />
                    )}
                </Form.Group>
            </Col>

            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        <h6>Тип аппарата</h6>
                    </Form.Label>
                    <Form.Select
                        value={device.deviceType}
                        onChange={(e) =>
                            onChange({
                                ...device,
                                deviceType: e.target.value as DeviceType,
                            })
                        }
                        onBlur={() => handleBlur('deviceType')}
                        style={{
                            border: shouldHighlightError(
                                'deviceType',
                                device.deviceType
                            )
                                ? '1px solid red'
                                : '',
                        }}
                        required
                        size="sm"
                    >
                        {Object.values(DeviceType).map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Col>
        </Row>
    );
};

export default DeviceFormFields;
