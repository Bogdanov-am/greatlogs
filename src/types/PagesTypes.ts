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
        experimentDate: string;
        locations: string;
        description: string;
        hasEvents: boolean;
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
