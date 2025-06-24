import React from 'react';
import { Form, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { Device } from '../../types/DeviceInfoTypes';
import { DeviceFileUploadProps } from '../../types/DeviceInfoTypes';

const DeviceFileUpload: React.FC<DeviceFileUploadProps> = ({
    device,
    deviceIndex,
    handleFileChange,
    shouldHighlightError,
    handleBlur,
}) => {
    const onFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'onboardVideos' | 'parametersFiles'
    ) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            handleFileChange(field, [...device[field], ...newFiles]);
            handleBlur(field);
        }
    };

    const removeFile = (
        field: 'onboardVideos' | 'parametersFiles',
        index: number
    ) => {
        const updatedFiles = [...device[field]];
        updatedFiles.splice(index, 1);
        handleFileChange(field, updatedFiles);
    };

    return (
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        <h6
                            style={{
                                color: shouldHighlightError(
                                    `devices[${deviceIndex}].onboardVideos`,
                                    device.onboardVideos
                                )
                                    ? 'red'
                                    : '',
                            }}
                        >
                            Видео с борта
                        </h6>
                    </Form.Label>
                    <Form.Control
                        type="file"
                        accept="video/*"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onFileChange(e, 'onboardVideos')
                        }
                        multiple
                        size="sm"
                        style={{
                            border: shouldHighlightError(
                                `devices[${deviceIndex}].onboardVideos`,
                                device.onboardVideos
                            )
                                ? '1px solid red'
                                : '',
                        }}
                        required
                    />
                    {shouldHighlightError(
                        `devices[${deviceIndex}].onboardVideos`,
                        device.onboardVideos
                    ) && (
                        <Form.Text className="text-danger">
                            Пожалуйста, загрузите хотя бы одно видео
                        </Form.Text>
                    )}
                    {device.onboardVideos.length > 0 && (
                        <ListGroup className="mt-2">
                            {device.onboardVideos.map((file, index) => (
                                <ListGroup.Item
                                    key={index}
                                    className="d-flex justify-content-between"
                                >
                                    <small>{file.name}</small>
                                    <Badge
                                        bg="danger"
                                        onClick={() =>
                                            removeFile('onboardVideos', index)
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        ×
                                    </Badge>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        <h6
                            style={{
                                color: shouldHighlightError(
                                    `devices[${deviceIndex}].parametersFiles`,
                                    device.parametersFiles
                                )
                                    ? 'red'
                                    : '',
                            }}
                        >
                            Файлы параметров
                        </h6>
                    </Form.Label>
                    <Form.Control
                        type="file"
                        accept=".params,.parm"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onFileChange(e, 'parametersFiles')
                        }
                        multiple
                        style={{
                            border: shouldHighlightError(
                                `devices[${deviceIndex}].parametersFiles`,
                                device.parametersFiles
                            )
                                ? '1px solid red'
                                : '',
                        }}
                        required
                        size="sm"
                    />
                    {shouldHighlightError(
                        `devices[${deviceIndex}].parametersFiles`,
                        device.parametersFiles
                    ) && (
                        <Form.Text className="text-danger">
                            Пожалуйста, загрузите хотя бы один файл параметров
                        </Form.Text>
                    )}
                    {device.parametersFiles.length > 0 && (
                        <ListGroup className="mt-2">
                            {device.parametersFiles.map((file, index) => (
                                <ListGroup.Item
                                    key={index}
                                    className="d-flex justify-content-between"
                                >
                                    <small>{file.name}</small>
                                    <Badge
                                        bg="danger"
                                        onClick={() =>
                                            removeFile('parametersFiles', index)
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        ×
                                    </Badge>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form.Group>
            </Col>
        </Row>
    );
};

export default DeviceFileUpload;
