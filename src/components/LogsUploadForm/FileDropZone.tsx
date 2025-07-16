import React from "react";
import { Card, Button } from "react-bootstrap";
import { FileDropZoneProps } from "../../types/LogsUploadTypes";

const FileDropZone: React.FC<FileDropZoneProps> = ({
    onFilesSelected,
    dragActive,
    onDragEvent,
    onDrop,
}) => (
    <Card
        className={`text-center p-5 ${
            dragActive ? "border-primary bg-light" : ""
        }`}
        onDragEnter={onDragEvent}
        onDragLeave={onDragEvent}
        onDragOver={onDragEvent}
        onDrop={onDrop}
    >
        <div className="d-flex flex-column align-items-center">
            <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mb-3"
            >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p className="mb-3">Перетащите файлы сюда или</p>
            <input
                type="file"
                id="file-upload"
                multiple
                accept=".tlog"
                onChange={(e) =>
                    e.target.files && onFilesSelected(e.target.files)
                }
                className="d-none"
            />
            <Button as="label" htmlFor="file-upload" variant="primary">
                Выбрать файлы
            </Button>
            <p className="mt-2 text-muted">Поддерживаются только .tlog файлы</p>
        </div>
    </Card>
);

export default FileDropZone;