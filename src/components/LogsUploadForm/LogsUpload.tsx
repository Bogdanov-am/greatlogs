import React, { useState, useCallback, useEffect } from 'react';
import { Container, Col, Card, Alert } from 'react-bootstrap';
import { UploadingFile, StoredUploadFile } from '../../types/LogsUploadTypes';
import { LogsUploadProps } from '../../types/LogsUploadTypes';
import FileDropZone from './FileDropZone';
import UploadedFilesList from './UploadedFilesList';
import ActionButtons from './ActionButtons';
import { postLogsUpload } from '../../api'; // Добавьте этот импорт
import { handleCancelWithDelete } from '../../utils/handleCancel';

const LogsUpload: React.FC<LogsUploadProps> = ({
    experimentId,
    onBack,
    onNext,
    onFilesUploaded,
    uploadedFiles = [],
    onDeleteExperiment
}) => {
    const [files, setFiles] = useState<UploadingFile[]>(() => {
        return uploadedFiles.map((file) => ({
            ...file,
            file: new File([], file.name),
        }));
    });

    const [dragActive, setDragActive] = useState(false);
    const [showNoFilesAlert, setShowNoFilesAlert] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null); // Состояние для ошибок

    useEffect(() => {
        const completedFiles = files.filter((f) => f.status === 'completed');
        if (completedFiles.length > 0) {
            onFilesUploaded(completedFiles.map(({ file, ...rest }) => rest));
        }
    }, [files, onFilesUploaded]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
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
        const newFiles: UploadingFile[] = Array.from(fileList)
            .filter((file) => file.name.endsWith('.tlog'))
            .map((file) => ({
                id: Math.random().toString(36).substring(2, 9),
                name: file.name,
                progress: 0,
                status: 'pending',
                file: file,
            }));

        if (newFiles.length > 0) {
            setFiles((prev) => [...prev, ...newFiles]);
            uploadFiles(newFiles); // Заменили simulateUpload на uploadFiles
        }
    };

    const uploadFiles = async (filesToUpload: UploadingFile[]) => {
        setUploadError(null);

        setFiles((prev) =>
            prev.map((f) =>
                filesToUpload.some((uploadFile) => uploadFile.id === f.id)
                    ? { ...f, status: 'uploading' }
                    : f
            )
        );

        try {
            const result = await postLogsUpload(filesToUpload, experimentId); // Ждём ответа

            setFiles((prev) =>
                prev.map((f) =>
                    filesToUpload.some((uploadFile) => uploadFile.id === f.id)
                        ? { ...f, status: 'completed', progress: 100 }
                        : f
                )
            );
            
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Неизвестная ошибка загрузки';

            setUploadError(errorMessage);
            setFiles((prev) =>
                prev.map((f) =>
                    filesToUpload.some((uploadFile) => uploadFile.id === f.id)
                        ? { ...f, status: 'error' }
                        : f
                )
            );
        }
    };


    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((file) => file.id !== id));
    };

    const cancelAll = () => {
        setShowNoFilesAlert(false);
        setFiles([]);
    };

    const handleNextClick = () => {
        if (files.length === 0) {
            setShowNoFilesAlert(true);
            return;
        }

        if (files.some((f) => f.status !== 'completed')) {
            return;
        }

        onNext();
    };

    // const handleCancelWithDelete = async () => {
    //     if (
    //         window.confirm(
    //             'Вы уверены, что хотите отменить создание испытания? Все введенные данные будут потеряны.'
    //         )
    //     ) {
    //         if (experimentId) {
    //             await onDeleteExperiment(experimentId.toString()); // Вызываем onDeleteExperiment
    //         }
    //         localStorage.removeItem('experimentForm');
    //         window.location.href = '/';
    //     }
    // };

    return (
        <Container
            className="mt-5"
            style={{ maxWidth: '650px', minWidth: '300px' }}
        >
            <h2 className="mb-4">Загрузите логи (*.tlog)</h2>

            {showNoFilesAlert && (
                <Alert
                    variant="danger"
                    onClose={() => setShowNoFilesAlert(false)}
                    dismissible
                >
                    Добавьте хотя бы один файл
                </Alert>
            )}

            {uploadError && (
                <Alert
                    variant="danger"
                    onClose={() => setUploadError(null)}
                    dismissible
                >
                    {uploadError}
                </Alert>
            )}

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
                    <UploadedFilesList
                        files={files.map(({ file, ...rest }) => rest)}
                        onRemove={removeFile}
                    />
                )}
            </Col>

            <ActionButtons
                hasFiles={files.length > 0}
                isNextDisabled={files.some((f) => f.status !== 'completed')}
                onCancel={() => handleCancelWithDelete(experimentId, onDeleteExperiment)}
                onCancelLogs={cancelAll}
                onNext={handleNextClick}
            />
        </Container>
    );
};

export default LogsUpload;
