export interface StoredUploadFile {
   id: string;
   name: string;
   progress: number;
   status: 'pending' | 'uploading' | 'completed' | 'error';
   // file: File;
}

export interface UploadingFile extends StoredUploadFile {
   file: File;
}

export type UploadFile = StoredUploadFile | UploadingFile

export interface LogsUploadProps {
   onNext: () => void;
   onBack: () => void;
   onFilesUploaded: (files: UploadFile[]) => void;
   uploadedFiles: UploadFile[];
   experimentId?: number;
}

export interface UploadedFilesListProps {
   files: UploadFile[];
   onRemove: (id: string) => void;
}

export interface FileDropZoneProps {
   onFilesSelected: (files: FileList) => void;
   dragActive: boolean;
   onDragEvent: (e: React.DragEvent) => void;
   onDrop: (e: React.DragEvent) => void;
}

export interface ActionButtonsProps {
   onBack: () => void;
   onCancel: () => void;
   onNext: () => void;
   isNextDisabled: boolean;
   hasFiles: boolean;
}