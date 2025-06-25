import React from 'react';
import { Card, Container } from 'react-bootstrap';
import { DeviceItemProps } from '../../types/DeviceInfoTypes';
import DeviceFormFields from './DeviceFormFields';
import DeviceFileUpload from './DeviceFileUpload';

const DeviceItem: React.FC<DeviceItemProps> = ({
    device,
    onChange,
    shouldHighlightError,
    markFieldAsTouched,
}) => {
    const handleBlur = (fieldName: string) => {
        markFieldAsTouched(`devices.${fieldName}`);
    };

    const handleFileChange = (
        field: 'onboardVideos' | 'parametersFiles',
        files: File[]
    ) => {
        onChange({ ...device, [field]: files });
        markFieldAsTouched(`devices.${field}`);
    };

    return (
        <Container className="text-start mb-3">
            <Card className="p-3">
                <DeviceFormFields
                    device={device}
                    onChange={onChange}
                    shouldHighlightError={shouldHighlightError}
                    handleBlur={handleBlur}
                />

                <DeviceFileUpload
                    device={device}
                    handleFileChange={handleFileChange}
                    shouldHighlightError={shouldHighlightError}
                    handleBlur={handleBlur}
                />
            </Card>
        </Container>
    );
};

export default DeviceItem;
