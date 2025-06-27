import React, { useCallback, useState } from 'react';
import { Container } from 'react-bootstrap';
import LogsUpload from '../components/LogsUploadForm/LogsUpload';
import ExperimentInfo from '../components/ExperimentInfoForm/ExperimentInfo';
import DevicesForm from '../components/DeviceInfoForm/DeviceInfo';
import EventInfo from '../components/EventInfoForm/EventInfo';
import OtherFiles from '../components/OtherFilesForm/OtherFiles';
import { CustomFormData, TestEntry } from '../types/PagesTypes';
import { Operator, SelectItem } from '../types/ExperimentInfoTypes';
import { UploadFile } from '../types/LogsUploadTypes';
import { AdditionalFile } from '../types/OtherFilesTypes';
import { fetchLogsUpload } from '../api'

interface FormsPageProps {
    onSubmit: (test: TestEntry) => void;
    onCancel: () => void;
}

const FormsPage: React.FC<FormsPageProps> = ({ onSubmit, onCancel }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<CustomFormData>({
        files: [],
        experiment: {
            testDate: '',
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
    });
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
        {}
    );

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1: // LogsUpload
                return (
                    formData.files.length > 0 &&
                    formData.files.every((f) => f.progress === 100)
                );

            case 2: // ExperimentInfo
                const {
                    testDate,
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
                    testDate.trim() !== '' && description.trim() !== '';

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
        if (fieldName === 'experiment.operators') return false;

        const isTouched = touchedFields[fieldName];
        if (!isTouched) return false;

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

        // if (currentStep === 1) {
        //     try {
        //         await uploadFilesToBackend(formData.files);
        //         setCurrentStep((prev) => prev + 1);
        //     } catch (error) {
        //         alert('Ошибка закрузки файлов');
        //         return;
        //     }
        // } НЕ УБИРАТЬ НИ В КОЕМ СЛУЧАЕ
        
        if (currentStep === 2) {
            //ExperimentInfo
            const requiredFields = [
                'testDate',
                'selectedLocation',
                'description',
                'reportFile',
                'operators',
                'responsibleOperator',
                'recordCreator',
            ];

            requiredFields.forEach((field) => {
                newTouched[`experiment.${field}`] = true;
            });

            formData.experiment.operators.forEach((operator) => {
                newTouched[`experiment.operators[${operator.id}].fullName`] =
                    true;
            });
        } else if (currentStep === 4) {
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
            id: Date.now().toString(),
            creationDate: new Date().toLocaleDateString('ru-RU'),
            testDate: formData.experiment.testDate,
            description: formData.experiment.description,
            location: formData.experiment.selectedLocation?.label || '',
            equipment: formData.devices
                .map(
                    (device) => `${device.mavlinkSysId} (${device.deviceType})`
                )
                .join(', '),
        };

        onSubmit(newTest); // Передаем данные в App
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

    const onFilesUploaded = useCallback((files: UploadFile[]) => {
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
                <LogsUpload
                    onNext={handleNext}
                    onFilesUploaded={onFilesUploaded}
                    uploadedFiles={formData.files}
                />
            ) : // В разделе return компонента FormsPage замените текущий закомментированный блок на:
            currentStep === 2 ? (
                <ExperimentInfo
                    data={{
                        ...formData.experiment,
                        operators: formData.experiment.operators.map(
                            (op: Operator) => ({
                                ...op,
                                label: op.fullName,
                            })
                        ),
                        // Удаляем locations: [], так как больше не используется
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
                            },
                        }));
                    }}
                    onBack={() => setCurrentStep(1)}
                    onNext={handleNext}
                    shouldHighlightError={shouldHighlightError}
                    markFieldAsTouched={markFieldAsTouched}
                    touchedFields={touchedFields}
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
                />
            ) : null}
        </Container>
    );
};

export default FormsPage;
