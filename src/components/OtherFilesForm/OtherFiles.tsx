import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Spinner } from 'react-bootstrap';
import ScreenshotsSection from './ScreenshotsSection';
import RecordingsSection from './RecordingsSection';
import AttachmentsSection from './AttachmentsSection';
import { OtherFilesProps, AdditionalFile } from '../../types/OtherFilesTypes';
import { saveOtherFiles } from '../../api';
import { handleCancel } from '../../utils/handleCancel';
import { handleCancelWithDelete } from '../../utils/handleCancel';

const OtherFiles: React.FC<OtherFilesProps> = ({
    experimentId,
    onSubmit,
    onBack,
    initialData,
    shouldHighlightError,
    markFieldAsTouched,
    onChange,
    clearTouchedFieldsByPrefix,
    validateStep,
    onDeleteExperiment
}) => {
    const [screenshots, setScreenshots] = useState<AdditionalFile[]>(
        initialData?.screenshots ?? []
    );
    const [screenRecordings, setScreenRecordings] = useState<(File | null)[]>(
        initialData?.screenRecordings ?? []
    );
    const [additionalAttachments, setAdditionalAttachments] = useState<
        (File | null)[]
    >(initialData?.additionalAttachments ?? []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        onChange({
            screenshots,
            screenRecordings,
            additionalAttachments,
        });
    }, [screenshots, screenRecordings, additionalAttachments, onChange]);

    const handleSubmitWithSave = async () => {
        // Добавлено async здесь
        setIsSubmitting(true);
        setError(null);

        try {
            // Валидация полей
            screenshots.forEach((_, i) => {
                markFieldAsTouched(`otherFiles.screenshots[${i}].file`);
                markFieldAsTouched(`otherFiles.screenshots[${i}].description`);
            });

            screenRecordings.forEach((_, i) => {
                markFieldAsTouched(`otherFiles.screenRecordings[${i}]`);
            });

            additionalAttachments.forEach((_, i) => {
                markFieldAsTouched(`otherFiles.additionalAttachments[${i}]`);
            });

            if (!validateStep()) {
                throw new Error('Заполните все обязательные поля');
            }

            await saveOtherFiles(
                {
                    screenshots,
                    screenRecordings,
                    additionalAttachments,
                },
                experimentId
            );

            onSubmit();
        } catch (error) {
            console.error('Ошибка сохранения дополнительных файлов: ', error);
            setError(
                error instanceof Error
                    ? error.message
                    : 'Ошибка при сохранении файлов'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">
                Файлы от операторов и дополнительные вложения
            </h2>
            <Card>
                <Card.Body>
                    <ScreenshotsSection
                        screenshots={screenshots}
                        onAdd={() =>
                            setScreenshots([
                                ...screenshots,
                                { file: null, description: '' },
                            ])
                        }
                        onFileChange={(index, file) => {
                            const newScreenshots = [...screenshots];
                            newScreenshots[index].file = file;
                            setScreenshots(newScreenshots);
                        }}
                        onDescriptionChange={(index, description) => {
                            const newScreenshots = [...screenshots];
                            newScreenshots[index].description = description;
                            setScreenshots(newScreenshots);
                        }}
                        onRemove={(index) => {
                            setScreenshots(
                                screenshots.filter((_, i) => i !== index)
                            );
                            clearTouchedFieldsByPrefix(
                                'otherFiles.screenshots'
                            );
                        }}
                        shouldHighlightError={shouldHighlightError}
                        markFieldAsTouched={markFieldAsTouched}
                    />

                    <RecordingsSection
                        recordings={screenRecordings}
                        onAdd={() =>
                            setScreenRecordings([...screenRecordings, null])
                        }
                        onFileChange={(index, file) => {
                            const newRecordings = [...screenRecordings];
                            newRecordings[index] = file;
                            setScreenRecordings(newRecordings);
                        }}
                        onRemove={(index) => {
                            setScreenRecordings(
                                screenRecordings.filter((_, i) => i !== index)
                            );
                            clearTouchedFieldsByPrefix(
                                'otherFiles.screenRecordings'
                            );
                        }}
                        shouldHighlightError={shouldHighlightError}
                        markFieldAsTouched={markFieldAsTouched}
                    />

                    <AttachmentsSection
                        attachments={additionalAttachments}
                        onAdd={() =>
                            setAdditionalAttachments([
                                ...additionalAttachments,
                                null,
                            ])
                        }
                        onFileChange={(index, file) => {
                            const newAttachments = [...additionalAttachments];
                            newAttachments[index] = file;
                            setAdditionalAttachments(newAttachments);
                        }}
                        onRemove={(index) => {
                            setAdditionalAttachments(
                                additionalAttachments.filter(
                                    (_, i) => i !== index
                                )
                            );
                            clearTouchedFieldsByPrefix(
                                'otherFiles.additionalAttachments'
                            );
                        }}
                        shouldHighlightError={shouldHighlightError}
                        markFieldAsTouched={markFieldAsTouched}
                    />
                </Card.Body>
                <div className="d-flex justify-content-between pt-3 p-4">
                    <Button
                        variant="danger"
                        onClick={() => handleCancelWithDelete(experimentId, onDeleteExperiment)}
                        size="lg"
                    >
                        Отменить
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmitWithSave}
                        size="lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <span className="ms-2">Сохранение...</span>
                            </>
                        ) : (
                            'Создать запись'
                        )}
                    </Button>
                </div>
            </Card>
        </Container>
    );
};

export default OtherFiles;
