import React, { useState, useEffect } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import ScreenshotsSection from './ScreenshotsSection';
import RecordingsSection from './RecordingsSection';
import AttachmentsSection from './AttachmentsSection';
import { OtherFilesProps, AdditionalFile } from '../../types/OtherFilesTypes';

const OtherFiles: React.FC<OtherFilesProps> = ({
    onSubmit,
    onBack,
    initialData,
    shouldHighlightError,
    markFieldAsTouched,
    // markFieldAsUntouched,
    onChange,
    clearTouchedFieldsByPrefix,
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

    useEffect(() => {
        onChange({
            screenshots,
            screenRecordings,
            additionalAttachments,
        });
    }, [screenshots, screenRecordings, additionalAttachments, onChange]);

    const clearTouchedFields = () => {
        // Очищаем touched для всех существующих полей
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
                        // onRemove={(index) => {
                        //     setScreenshots(
                        //         screenshots.filter((_, i) => i !== index)
                        //     );
                        //     markFieldAsUntouched(
                        //         `otherFiles.screenshots[${index}].file`
                        //     );
                        //     markFieldAsUntouched(
                        //         `otherFiles.screenshots[${index}].description`
                        //     );
                        // }}
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
                        // onRemove={(index) => {
                        //     setScreenRecordings(
                        //         screenRecordings.filter((_, i) => i !== index)
                        //     );
                        //     markFieldAsUntouched(
                        //         `otherFiles.screenRecordings[${index}]`
                        //     );
                        // }}
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
                        // onRemove={(index) => {
                        //     setAdditionalAttachments(
                        //         additionalAttachments.filter(
                        //             (_, i) => i !== index
                        //         )
                        //     );
                        //     markFieldAsUntouched(
                        //         `otherFiles.additionalAttachments[${index}]`
                        //     );
                        // }}
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
                        variant="outline-secondary"
                        onClick={onBack}
                        size="lg"
                    >
                        Назад
                    </Button>
                    <Button variant="primary" onClick={onSubmit} size="lg">
                        Создать запись
                    </Button>
                </div>
                ;
            </Card>
        </Container>
    );
};

export default OtherFiles;
