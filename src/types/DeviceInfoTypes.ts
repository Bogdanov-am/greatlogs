export interface Device {
    mavlinkSysId: string;
    serialNumber: string;
    deviceType: string;
    onboardVideos: File[];
    parametersFiles: File[];
}

export interface DeviceFormProps {
    device: Device;
    onChange: (field: keyof Device, value: any) => void;
    onFileChange: (
        field: "onboardVideo" | "parametersFile",
        file: File | null
    ) => void;
    deviceIndex: number;
    shouldHighlightError: (field: string, value: any) => boolean;
    markFieldAsTouched: (field: string) => void;
}

export interface DeviceItemProps {
    device: Device;
    deviceIndex: number;
    onChange: (device: Device) => void;
    onRemove?: () => void;
    showRemoveButton: boolean;
    shouldHighlightError: (field: string, value: any) => boolean;
    markFieldAsTouched: (field: string) => void;    
}

export interface DevicesFormProps {
    devices: Device[];
    onChange: (devices: Device[]) => void;
    onBack: () => void;
    onNext: () => void;
    hasEvents: boolean;
    shouldHighlightError: (field: string, value: any) => boolean;
    markFieldAsTouched: (field: string) => void;
    validateStep: () => boolean;
}

export interface DeviceFileUploadProps {
    device: Device;
    deviceIndex: number;
    handleFileChange: (field: 'onboardVideos' | 'parametersFiles', files: File[]) => void;
    shouldHighlightError: (fieldName: string, value: any) => boolean;
    handleBlur: (fieldName: string) => void;
}
