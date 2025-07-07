export interface Event {
    time: string;
    description: string;
    deviceIds: string[];
}

export interface EventItemProps {
    event: Event;
    eventIndex: number;
    devices: { mavlinkSysId: string }[];
    onChange: (index: number, event: Event) => void;
    onRemove: (index: number) => void;
    showRemoveButton: boolean;
    handleDeviceSelection: (
        eventIndex: number,
        deviceId: string,
        isChecked: boolean
    ) => void;
}

export interface EventInfoProps {
    events: Event[];
    devices: { mavlinkSysId: string }[];
    onChange: (events: Event[]) => void;
    onBack: () => void;
    onNext: () => void;
    shouldHighlightError: (fieldName: string, value: any) => boolean;
    markFieldAsTouched: (fieldName: string) => void;
    validateStep: () => boolean;
    experimentId?: number;
}

export interface EventTimeInputProps {
    time: string;
    onChange: (time: string) => void;
    onBlur: () => void;
    shouldHighlightError: boolean;
}

export interface EventDescriptionInputProps {
    description: string;
    onChange: (description: string) => void;
    onBlur: () => void;
    shouldHighlightError: boolean;
}

export interface EventDevicesChecklistProps {
    devices: { mavlinkSysId: string }[];
    deviceIds: string[];
    handleDeviceSelection: (deviceId: string, isChecked: boolean) => void;
}

export interface EventActionsProps {
    showRemoveButton: boolean;
    onRemove: () => void;
}

export interface EventActionsProps {
    showRemoveButton: boolean;
    onRemove: () => void;
}