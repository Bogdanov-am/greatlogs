import React, { useState, useCallback, useEffect } from "react";
import { Container, Col, Card } from "react-bootstrap";
import { UploadFile, LogsUploadProps } from "../../types/LogsUploadTypes";
import FileDropZone from "./FileDropZone";
import UploadedFilesList from "./UploadedFilesList";
import ActionButtons from "./ActionButtons";

const LogsUpload: React.FC<LogsUploadProps> = ({
    onNext,
    onFilesUploaded,
    uploadedFiles = [],
}) => {
    const [files, setFiles] = useState<UploadFile[]>(uploadedFiles);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        onFilesUploaded(files);
    }, [files, onFilesUploaded]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer?.files) {
            processFiles(e.dataTransfer.files);
        }
    }, []);

    const processFiles = (fileList: FileList) => {
        const newFiles: UploadFile[] = Array.from(fileList)
            .filter((file) => file.name.endsWith(".tlog"))
            .map((file) => ({
                id: Math.random().toString(36).substring(2, 9),
                name: file.name,
                progress: 0,
                status: "pending",
            }));

        if (newFiles.length > 0) {
            setFiles((prev) => [...prev, ...newFiles]);
            simulateUpload(newFiles);
        }
    };

    const simulateUpload = (filesToUpload: UploadFile[]) => {
        filesToUpload.forEach((file) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === file.id
                            ? {
                                  ...f,
                                  progress,
                                  status:
                                      progress < 100
                                          ? "uploading"
                                          : "completed",
                              }
                            : f
                    )
                );
            }, 300);
        });
    };

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((file) => file.id !== id));
    };

    const cancelAll = () => {
        setFiles([]);
    };

    return (
        <Container
            className="mt-5"
            style={{ maxWidth: "650px", minWidth: "300px" }}
        >
            <h2 className="mb-4">Загрузите логи (*.tlog)</h2>

            <Col className="mb-4">
                <FileDropZone
                    dragActive={dragActive}
                    onDragEvent={handleDrag}
                    onDrop={handleDrop}
                    onFilesSelected={processFiles}
                />
            </Col>

            <Col>
                {files.length === 0 ? (
                    <Card className="p-4 text-center text-muted">
                        Загруженные файлы появляются здесь
                    </Card>
                ) : (
                    <UploadedFilesList files={files} onRemove={removeFile} />
                )}
            </Col>

            <ActionButtons
                hasFiles={files.length > 0}
                isNextDisabled={
                    files.length === 0 || files.some((f) => f.progress < 100)
                }
                onCancel={cancelAll}
                onNext={onNext}
            />
        </Container>
    );
};

export default LogsUpload;
