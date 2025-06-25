import React from 'react';
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
    return (
        <Row>
            <Col md={6}>
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
            <Col md={6}>
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
