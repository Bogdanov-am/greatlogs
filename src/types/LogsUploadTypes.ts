export interface UploadFile {
   id: string;
   name: string;
   progress: number;
   status: 'pending' | 'uploading' | 'completed' | 'error';
   file: File;
}

export interface LogsUploadProps {
   onNext: () => void;
   onFilesUploaded: (files: UploadFile[]) => void;
   uploadedFiles: UploadFile[];
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
   onCancel: () => void;
   onNext: () => void;
   isNextDisabled: boolean;
   hasFiles: boolean;
}