import { OtherFilesData } from './OtherFilesTypes'
import { Event } from './EventInfoTypes'
import { Device } from './DeviceInfoTypes'
import { StoredUploadFile } from './LogsUploadTypes'
import { SelectItem, Operator } from './ExperimentInfoTypes'

export interface TestEntry {
    id: string;
    creationDate: string;
    testDate: string;
    description: string;
    location: string;
    equipment: string;
}

export interface ActionButtonsProps {
    onBack: () => void;
    onNext: () => void;
}

export interface CustomFormData {
    files: StoredUploadFile[];
    experiment: {
        experimentId?: number;
        experimentDate: string;
        locations: string;
        description: string;
        // hasEvents: boolean;
        reportFile: File | null;
        operators: Operator[];
        availableLocations: SelectItem[]; // Доступные локации
        availableOperators: SelectItem[]; // Доступные операторы
        responsibleOperator: SelectItem | null; // Ответственный оператор
        recordCreator: SelectItem | null;
        selectedLocation: SelectItem | null;
        loadingLocations?: boolean;
        loadingOperators?: boolean;

    };
    devices: Device[];
    events: Event[];
    otherFiles: OtherFilesData;
}

export interface ExperimentDetails {
    id: number;
    created_date: string;
    description: string;
    report_file: string | null;
    responsible_operator: string;
    creator_operator: string;
    location: string | null;
    operators: string[];
    devices: Array<{
        type: string;
        mavlink_id: number;
        onboard_video: string[];
        parameters_files: string[];
    }>;
    events: Array<{
        time: string;
        description: string;
        devices: number[];
    }>;
    logs: Array<{
        path: string;
        devices: number[];
    }>;
    screenshots: Array<{
        path: string;
        description: string;
    }>;
    screen_recordings: string[];
    attachments: string[];
    parameters: Array<{
        device_id: number;
        path: string;
    }>;
}
