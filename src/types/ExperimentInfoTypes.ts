export interface ExperimentInfoProps {
    data: {
        testDate: string;
        locations: string;
        description: string;
        hasEvents: boolean;
        reportFile: File | null;
        operators: Operator[];
        availableLocations: SelectItem[];
        availableOperators: SelectItem[];
        responsibleOperator: SelectItem | null;
        recordCreator: SelectItem | null;
        selectedLocation: SelectItem | null;
        loadingLocations?: boolean;
        loadingOperators?: boolean;
    };
    onChange: (data: any) => void;
    onBack: () => void;
    onNext: () => void;
    shouldHighlightError: (fieldName: string, value: any) => boolean;
    markFieldAsTouched: (fieldName: string) => void;
    touchedFields: Record<string, boolean>
}

export interface Operator extends SelectItem {
    id: number;
    fullName: string;
    isResponsible: boolean;
    label: string;
}

export interface AuthorSectionProps {
    data: ExperimentInfoProps['data'];
    onChange: ExperimentInfoProps['onChange'];
    hasResponsible: boolean;
    shouldHighlightError: (field: string, value: any) => boolean;
    markFieldAsTouched: (field: string) => void;
}

export interface OperatorsListProps {
    data: ExperimentInfoProps['data'];
    onChange: ExperimentInfoProps['onChange'];
    hasResponsible: boolean;
    shouldHighlightError: (field: string, value: any) => boolean;
    markFieldAsTouched: (field: string) => void;
}

export interface ExperimentBaseFormProps {
    data: ExperimentInfoProps['data'];
    onChange: ExperimentInfoProps['onChange'];
    shouldHighlightError: (field: string, value: any) => boolean;
    markFieldAsTouched: (field: string) => void;
    touchedFields: Record<string, boolean>
}

export interface OperatorFormProps {
    operator: Operator;
    onChange: (operator: Operator) => void;
    onRemove: () => void;
    hasResponsible: boolean;
    shouldHighlightError: (field: string, value: any) => boolean;
    markFieldAsTouched: (field: string) => void;
}

export interface SelectItem {
    id: string | number;
    label: string;
}

export interface MultiSelectProps {
    items: SelectItem[];
    selectedItems: SelectItem[];
    onSelectionChange: (items: SelectItem[]) => void;
    loading?: boolean;
}

export interface SingleSelectProps {
    items: SelectItem[];
    selectedItem: SelectItem | null;
    onSelectionChange: (item: SelectItem | null) => void;
    loading?: boolean;
}


export interface OperatorsMultiSelectProps {
    operators: SelectItem[];
    selectedOperators: SelectItem[];
    onOperatorsChange: (operators: SelectItem[]) => void;
    loading?: boolean;
}
