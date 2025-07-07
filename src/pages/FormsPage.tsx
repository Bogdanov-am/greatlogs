import React, { useCallback, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import LogsUpload from '../components/LogsUploadForm/LogsUpload';
import ExperimentInfo from '../components/ExperimentInfoForm/ExperimentInfo';
import DevicesForm from '../components/DeviceInfoForm/DeviceInfo';
import EventInfo from '../components/EventInfoForm/EventInfo';
import OtherFiles from '../components/OtherFilesForm/OtherFiles';
import { CustomFormData, TestEntry } from '../types/PagesTypes';
import { Operator, SelectItem } from '../types/ExperimentInfoTypes';
import { StoredUploadFile } from '../types/LogsUploadTypes';
import { AdditionalFile } from '../types/OtherFilesTypes';
import { usePersistForm } from '../hooks/usePresistForm';
import { checkStorageLimit } from '../utils/storage';

interface FormsPageProps {
    onSubmit: (test: TestEntry) => void;
    onCancel: () => void;
}

const FormsPage: React.FC<FormsPageProps> = ({ onSubmit, onCancel }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [createdExperimentId, setcreatedExperimentId] = useState<
        number | null
    >(null);
    const [formData, setFormData] = usePersistForm<CustomFormData>(
        'experimentForm',
        {
            files: [],
            experiment: {
                experimentDate: '',
                locations: '',
                description: '',
                hasEvents: false,
                reportFile: null,
                operators: [],
                availableLocations: [],
                availableOperators: [],
                responsibleOperator: null,
                recordCreator: null,
                selectedLocation: null,
                loadingLocations: true,
                loadingOperators: true,
            },
            devices: [],
            events: [
                {
                    time: '',
                    description: '',
                    deviceIds: [],
                },
            ],
            otherFiles: {
                screenshots: [],
                screenRecordings: [],
                additionalAttachments: [],
            },
        }
    );

    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
        {}
    );

    useEffect(() => {
        const handler = (e: StorageEvent) => {
            if (e.key === 'experimentForm' && e.newValue) {
                try {
                    setFormData(JSON.parse(e.newValue));
                } catch (error) {
                    console.error('Ошибка синхронизации', error);
                }
            }
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    });

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1: // ExperimentInfo
                const {
                    experimentDate,
                    selectedLocation,
                    description,
                    reportFile,
                    responsibleOperator,
                    recordCreator,
                    operators,
                } = formData.experiment;

                const hasRecordCreator = recordCreator !== null;
                const hasResponsibleOperator = responsibleOperator !== null;
                const hasReportFile = reportFile !== null;
                const hasLocation = selectedLocation !== null;
                const hasOperators = operators.length > 0;
                const allTextFilelds =
                    experimentDate.trim() !== '' && description.trim() !== '';

                const allRequiredFieldsFilled =
                    hasRecordCreator &&
                    hasResponsibleOperator &&
                    hasReportFile &&
                    allTextFilelds &&
                    hasLocation &&
                    hasOperators;

                if (!allRequiredFieldsFilled) {
                    alert('Заполните все требуемые поля');
                    return false;
                }
                return true;

            case 2: // LogsUpload
                return (
                    formData.files.length > 0 &&
                    formData.files.every((f) => f.progress === 100)
                );

            case 4: // EventsInfo
                if (!formData.experiment.hasEvents) return true;
                const allEventsInfoFields = formData.events.every(
                    (event) =>
                        event.time.trim() !== '' &&
                        event.description.trim() !== ''
                );
                if (!allEventsInfoFields) {
                    alert('Заполните все требуемые поля');
                    return false;
                }
                return true;

            case 5:
                const { screenshots, screenRecordings, additionalAttachments } =
                    formData.otherFiles;

                const screenshotsValid =
                    screenshots.length === 0 ||
                    screenshots.every((s) => s?.file && s?.description?.trim());

                const recordingsValid =
                    screenRecordings.length === 0 ||
                    screenRecordings.every((recording) => recording !== null);

                const attachmentsValid =
                    additionalAttachments.length === 0 ||
                    additionalAttachments.every(
                        (attachment) => attachment !== null
                    );

                if (
                    !screenshotsValid ||
                    !recordingsValid ||
                    !attachmentsValid
                ) {
                    alert('Заполните все добавленные формы или удалите их');
                    return false;
                }

                return true;

            default:
                return true;
        }
    };

    const markFieldAsTouched = (fieldName: string) => {
        setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    };

    const shouldHighlightError = (fieldName: string, value: any): boolean => {
        const isTouched = touchedFields[fieldName];
        if (!isTouched) return false;

        if (fieldName === 'experiment.operators') {
            return Array.isArray(value) ? value.length === 0 : true;
        }

        if (
            fieldName.includes('onboardVideos') ||
            fieldName.includes('parametersFiles')
        ) {
            return Array.isArray(value) ? value.length === 0 : true;
        }

        if (typeof value === 'string') {
            return value.trim() === '';
        }

        return !value;
    };

    const handleNext = async () => {
        const newTouched: Record<string, boolean> = {};

        if (currentStep === 1) {
            try {
                const {
                    experimentDate,
                    description,
                    reportFile,
                    responsibleOperator,
                    recordCreator,
                } = formData.experiment;

                if (!reportFile || !responsibleOperator || !recordCreator) {
                    alert('Пожалуйста заполните все поля');
                    return;
                }

                setCurrentStep((prev) => prev + 1);
            } catch (error) {
                console.error('Error saving experiment:', error);
                let errorMessage = 'Failed to save experiment data';
                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }
                alert(errorMessage);
            }
        } else {
            if (currentStep === 4) {
                // EventInfo
                formData.events.forEach((_, index) => {
                    ['time', 'description'].forEach((field) => {
                        newTouched[`events[${index}].${field}`] = true;
                    });
                });
            }

            setTouchedFields((prev) => ({ ...prev, ...newTouched }));

            if (!validateStep(currentStep)) {
                return;
            }

            if (currentStep === 3 && !formData.experiment.hasEvents) {
                setCurrentStep((prev) => prev + 2);
            } else {
                setCurrentStep((prev) => prev + 1);
            }
        }
    };

    const handleSubmit = () => {
        const newTouched: Record<string, boolean> = {};

        formData.otherFiles.screenshots.forEach((_, i) => {
            newTouched[`otherFiles.screenshots[${i}].file`] = true;
            newTouched[`otherFiles.screenshots[${i}].description`] = true;
        });

        formData.otherFiles.screenRecordings.forEach((_, i) => {
            newTouched[`otherFiles.screenRecordings[${i}]`] = true;
        });

        formData.otherFiles.additionalAttachments.forEach((_, i) => {
            newTouched[`otherFiles.additionalAttachments[${i}]`] = true;
        });

        setTouchedFields((prev) => ({ ...prev, ...newTouched }));

        if (!validateStep(5)) {
            return;
        }

        const newTest: TestEntry = {
            id: formData.experiment.experimentId?.toString() ?? '',
            creationDate: new Date().toLocaleDateString('ru-RU'),
            testDate: formData.experiment.experimentDate,
            description: formData.experiment.description,
            location: formData.experiment.selectedLocation?.label || '',
            equipment: formData.devices
                .map(
                    (device) => `${device.mavlinkSysId} (${device.deviceType})`
                )
                .join(', '),
        };

        if (!checkStorageLimit(formData)) {
            alert('Данные слишком велики');
            return;
        }

        onSubmit(newTest); // Передаем данные в App
        localStorage.removeItem('experimentForm');
        onCancel();
    };

    const clearTouchedFieldsByPrefix = (prefix: string) => {
        setTouchedFields((prev) => {
            const newTouched = { ...prev };
            Object.keys(newTouched).forEach((key) => {
                if (key.startsWith(prefix)) {
                    delete newTouched[key];
                }
            });
            return newTouched;
        });
    };

    const onFilesUploaded = useCallback((files: StoredUploadFile[]) => {
        setFormData((prev) => ({ ...prev, files }));
    }, []);

    const handleotherFilesChange = useCallback(
        (newOtherFiles: {
            screenshots: AdditionalFile[];
            screenRecordings: (File | null)[];
            additionalAttachments: (File | null)[];
        }) => {
            setFormData((prev) => ({
                ...prev,
                otherFiles: newOtherFiles,
            }));
        },
        []
    );

    return (
        <Container className="my-4" style={{ maxWidth: '800px' }}>
            {currentStep === 1 ? (
                <ExperimentInfo
                    data={{
                        ...formData.experiment,
                        operators: formData.experiment.operators.map(
                            (op: Operator) => ({
                                ...op,
                                label: op.fullName,
                            })
                        ),
                    }}
                    onChange={(experimentData) => {
                        setFormData((prev) => ({
                            ...prev,
                            experiment: {
                                ...experimentData,
                                operators: experimentData.operators.map(
                                    (op: SelectItem) => ({
                                        id: op.id,
                                        fullName: op.label,
                                        isResponsible:
                                            (op as Operator).isResponsible ||
                                            false,
                                        label: op.label,
                                    })
                                ),
                                responsibleOperator:
                                    experimentData.responsibleOperator,
                                recordCreator: experimentData.recordCreator,
                                experimentId: experimentData.experimentId,
                            },
                        }));
                    }}
                    onNext={handleNext}
                    shouldHighlightError={shouldHighlightError}
                    markFieldAsTouched={markFieldAsTouched}
                    touchedFields={touchedFields}
                />
            ) : currentStep === 2 ? (
                <LogsUpload
                    onBack={() => setCurrentStep(1)}
                    onNext={handleNext}
                    onFilesUploaded={onFilesUploaded}
                    uploadedFiles={formData.files}
                    experimentId={formData.experiment.experimentId}
                />
            ) : currentStep === 3 ? (
                <DevicesForm
                    devices={formData.devices}
                    onChange={(devices) => {
                        setFormData((prev) => ({ ...prev, devices }));
                        const newTouched = { ...touchedFields };
                        Object.keys(newTouched).forEach((key) => {
                            if (key.startsWith('devices[')) {
                                delete newTouched[key];
                            }
                        });
                        setTouchedFields(newTouched);
                    }}
                    onBack={() => setCurrentStep(2)}
                    onNext={handleNext}
                    shouldHighlightError={shouldHighlightError}
                    markFieldAsTouched={markFieldAsTouched}
                    validateStep={() => validateStep(3)}
                    experimentId={formData.experiment.experimentId}
                />
            ) : currentStep === 4 ? (
                <EventInfo
                    events={formData.events}
                    devices={formData.devices}
                    onChange={(events) => {
                        setFormData((prev) => ({ ...prev, events }));
                        const newTouched = { ...touchedFields };
                        Object.keys(newTouched).forEach((key) => {
                            if (key.startsWith('events[')) {
                                delete newTouched[key];
                            }
                        });
                        setTouchedFields(newTouched);
                    }}
                    onBack={() => setCurrentStep(3)}
                    onNext={handleNext}
                    shouldHighlightError={shouldHighlightError}
                    markFieldAsTouched={markFieldAsTouched}
                    validateStep={() => validateStep(4)}
                    experimentId={formData.experiment.experimentId}
                />
            ) : currentStep === 5 ? (
                <OtherFiles
                    onSubmit={handleSubmit}
                    onBack={() =>
                        setCurrentStep(formData.experiment.hasEvents ? 4 : 3)
                    }
                    initialData={formData.otherFiles}
                    shouldHighlightError={shouldHighlightError}
                    markFieldAsTouched={markFieldAsTouched}
                    clearTouchedFieldsByPrefix={clearTouchedFieldsByPrefix}
                    validateStep={() => validateStep(5)}
                    onChange={handleotherFilesChange}
                    experimentId={formData.experiment.experimentId}
                />
            ) : null}
        </Container>
    );
};

export default FormsPage;
