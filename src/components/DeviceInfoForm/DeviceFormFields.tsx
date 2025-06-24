import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Device } from "../../types/DeviceInfoTypes";

interface DeviceFormFieldsProps {
    device: Device;
    deviceIndex: number;
    onChange: (device: Device) => void;
    shouldHighlightError: (fieldName: string, value: any) => boolean;
    handleBlur: (fieldName: string) => void;
}

const DeviceFormFields: React.FC<DeviceFormFieldsProps> = ({
    device,
    deviceIndex,
    onChange,
    shouldHighlightError,
    handleBlur,
}) => {
    return (
        <Row>
            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        <h6>MAVLink SYS_ID</h6>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        name="mavlinkSysId"
                        value={device.mavlinkSysId}
                        onChange={(e) =>
                            onChange({
                                ...device,
                                mavlinkSysId: e.target.value,
                            })
                        }
                        onBlur={() => handleBlur("mavlinkSysId")}
                        style={{
                            border: shouldHighlightError(
                                `devices[${deviceIndex}].mavlinkSysId`,
                                device.mavlinkSysId
                            )
                                ? "1px solid red"
                                : "",
                        }}
                        placeholder="SYS_ID"
                        size="sm"
                        required
                    />
                </Form.Group>
            </Col>
            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        <h6>Серийный номер</h6>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        value={device.serialNumber}
                        onChange={(e) =>
                            onChange({
                                ...device,
                                serialNumber: e.target.value,
                            })
                        }
                        onBlur={() => handleBlur("serialNumber")}
                        style={{
                            border: shouldHighlightError(
                                `devices[${deviceIndex}].serialNumber`,
                                device.serialNumber
                            )
                                ? "1px solid red"
                                : "",
                        }}
                        placeholder="Серийный номер"
                        required
                        size="sm"
                    />
                </Form.Group>
            </Col>
            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        <h6>Тип аппарата</h6>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        value={device.deviceType}
                        onChange={(e) =>
                            onChange({
                                ...device,
                                deviceType: e.target.value,
                            })
                        }
                        onBlur={() => handleBlur("deviceType")}
                        style={{
                            border: shouldHighlightError(
                                `devices[${deviceIndex}].deviceType`,
                                device.deviceType
                            )
                                ? "1px solid red"
                                : "",
                        }}
                        placeholder="Тип аппарата"
                        required
                        size="sm"
                    />
                </Form.Group>
            </Col>
        </Row>
    );
};

export default DeviceFormFields;
