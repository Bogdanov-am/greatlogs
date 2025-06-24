export interface AdditionalFile {
    file: File | null;
    description: string;
}

export interface OtherFilesData {
    screenshots: AdditionalFile[];
    screenRecordings: (File | null)[];
    additionalAttachments: (File | null)[];
}

export interface OtherFilesProps {
    onSubmit: () => void;
    onBack: () => void;
    initialData?: OtherFilesData;
    shouldHighlightError: (fieldName: string, value: any) => boolean;
    markFieldAsTouched: (fieldName: string) => void;
    // markFieldAsUntouched: (fieldName: string) => void;
    validateStep: () => boolean;
    onChange: (data: OtherFilesData) => void;
    clearTouchedFieldsByPrefix: (prefix: string) => void;
}

export interface FileInputRowProps {
    index: number;
    accept?: string;
    file: File | null;
    description?: string;
    onFileChange: (index: number, file: File | null) => void;
    onDescriptionChange?: (index: number, description: string) => void;
    onRemove: (index: number) => void;
    shouldHighlightError: (fieldName: string, value: any) => boolean;
    markFieldAsTouched: (fieldName: string) => void;
    fieldPrefix: string;
    showDescription?: boolean;
}

export interface AttachmentsSectionProps {
    attachments: (File | null)[];
    onAdd: () => void;
    onFileChange: (index: number, file: File | null) => void;
    onRemove: (index: number) => void;
    shouldHighlightError: (fieldName: string, value: any) => boolean;
    markFieldAsTouched: (fieldName: string) => void;
}

export interface RecordingsSectionProps {
    recordings: (File | null)[];
    onAdd: () => void;
    onFileChange: (index: number, file: File | null) => void;
    onRemove: (index: number) => void;
    shouldHighlightError: (fieldName: string, value: any) => boolean;
    markFieldAsTouched: (fieldName: string) => void;
}

export interface ScreenshotsSectionProps {
    screenshots: AdditionalFile[];
    onAdd: () => void;
    onFileChange: (index: number, file: File | null) => void;
    onDescriptionChange: (index: number, description: string) => void;
    onRemove: (index: number) => void;
    shouldHighlightError: (fieldName: string, value: any) => boolean;
    markFieldAsTouched: (fieldName: string) => void;
}