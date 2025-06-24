import React from "react";
import { Button, Card, Container } from "react-bootstrap";
import { Device, DevicesFormProps } from "../../types/DeviceInfoTypes";
import DeviceItem from "./DeviceItem";
import ActionButtons from "../ActionButtons";

const DevicesForm: React.FC<DevicesFormProps> = ({
    devices,
    onChange,
    onBack,
    onNext,
    shouldHighlightError,
    markFieldAsTouched,
}) => {
    const addDevice = () => {
        onChange([
            ...devices,
            {
                mavlinkSysId: "",
                serialNumber: "",
                deviceType: "",
                onboardVideos: [],
                parametersFiles: [],
            },
        ]);
    };

    const updateDevice = (index: number, device: Device) => {
        const newDevices = [...devices];
        newDevices[index] = device;
        onChange(newDevices);
    };

    const removeDevice = (index: number) => {
        const newDevices = devices.filter((_, i) => i !== index);
        onChange(newDevices);
    };

    return (
        <Container>
            <h2 className="mb-4">Аппараты</h2>
            <Card className="p-4">
                <div className="mb-4">
                    {devices.map((device, index) => (
                        <DeviceItem
                            key={index}
                            device={device}
                            onChange={(updatedDevice) =>
                                updateDevice(index, updatedDevice)
                            }
                            onRemove={() => removeDevice(index)}
                            showRemoveButton={devices.length > 1}
                            shouldHighlightError={shouldHighlightError}
                            markFieldAsTouched={markFieldAsTouched}
                            deviceIndex={index}
                        />
                    ))}

                    <Button
                        variant="outline-primary"
                        onClick={addDevice}
                        size="sm"
                        className="mb-3"
                    >
                        + Добавить аппарат
                    </Button>
                </div>
                <ActionButtons onBack={onBack} onNext={onNext} />
            </Card>
        </Container>
    );
};

export default DevicesForm;
