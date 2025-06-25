export enum DeviceType {
    ORKAN = 'Оркан',
    BRIZ = 'Бриз',
}

export interface Device {
    mavlinkSysId: string;
    deviceType: DeviceType
    onboardVideos: File[];
    parametersFiles: File[];
}

export interface DeviceItemProps {
    device: Device;
    onChange: (device: Device) => void;
    shouldHighlightError: (field: string, value: any) => boolean;
    markFieldAsTouched: (field: string) => void;    
}

export interface DevicesFormProps {
    devices: Device[];
    onChange: (devices: Device[]) => void;
    onBack: () => void;
    onNext: () => void;
    shouldHighlightError: (field: string, value: any) => boolean;
    markFieldAsTouched: (field: string) => void;
    validateStep: () => boolean;
}

export interface DeviceFileUploadProps {
    device: Device;
    handleFileChange: (field: 'onboardVideos' | 'parametersFiles', files: File[]) => void;
    shouldHighlightError: (fieldName: string, value: any) => boolean;
    handleBlur: (fieldName: string) => void;
}
