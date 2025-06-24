import { OtherFilesData } from '../types/OtherFilesTypes'
import { Event } from '../types/EventInfoTypes'
import { Device } from '../types/DeviceInfoTypes'
import { UploadFile } from '../types/LogsUploadTypes'
import { SelectItem, Operator } from '../types/ExperimentInfoFormTypes'

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

export interface FormData {
    files: UploadFile[];
    experiment: {
        testDate: string;
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
