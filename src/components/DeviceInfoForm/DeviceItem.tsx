import React from "react";
import { Button, Card, Container } from "react-bootstrap";
import { DeviceItemProps } from "../../types/DeviceInfoTypes";
import DeviceFormFields from "./DeviceFormFields";
import DeviceFileUpload from "./DeviceFileUpload";

const DeviceItem: React.FC<DeviceItemProps> = ({
    device,
    deviceIndex,
    onChange,
    onRemove,
    showRemoveButton,
    shouldHighlightError,
    markFieldAsTouched,
}) => {
    const handleBlur = (fieldName: string) => {
        markFieldAsTouched(`devices[${deviceIndex}].${fieldName}`);
    };

    const handleFileChange = (
        field: 'onboardVideos' | 'parametersFiles',
        files: File[]
    ) => {
        onChange({ ...device, [field]: files });
        markFieldAsTouched(`devices[${deviceIndex}.${field}]`)
    };

    return (
        <Container className="text-start">
            <h5>Аппарат {deviceIndex + 1}</h5>
            <Card className="mb-3 p-3">
                <DeviceFormFields
                    device={device}
                    deviceIndex={deviceIndex}
                    onChange={onChange}
                    shouldHighlightError={shouldHighlightError}
                    handleBlur={handleBlur}
                />

                <DeviceFileUpload
                    device={device}
                    deviceIndex={deviceIndex}
                    handleFileChange={handleFileChange}
                    shouldHighlightError={shouldHighlightError}
                    handleBlur={handleBlur}
                />

                {showRemoveButton && (
                    <Button
                        variant="outline-danger"
                        onClick={onRemove}
                        size="sm"
                        className="mt-2"
                    >
                        Удалить аппарат
                    </Button>
                )}
            </Card>
        </Container>
    );
};

export default DeviceItem;
