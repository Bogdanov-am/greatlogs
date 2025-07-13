import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { ExperimentInfoProps } from '../../types/ExperimentInfoTypes';
import ExperimentBaseForm from './ExperimentBaseForm';
import { getLocations, getOperators, saveExperimentInfo } from '../../api';
import { handleCancel } from '../../utils/handleCancel';

const ExperimentInfo: React.FC<ExperimentInfoProps> = ({
    data,
    onChange,
    onNext,
    shouldHighlightError,
    markFieldAsTouched,
    touchedFields,
}) => {
    const [loading, setLoading] = useState({
        locations: true,
        operators: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNextWithSave = async () => {
        setIsSubmitting(true);
        try {
            const missingFields = [];
            if (!data.experimentDate) missingFields.push('experimentDate');
            if (!data.description?.trim()) missingFields.push('description');
            if (!data.reportFile) missingFields.push('reportFile');
            if (!data.recordCreator) missingFields.push('recordCreator');
            if (!data.responsibleOperator)
                missingFields.push('responsibleOperator');

            if (missingFields.length > 0) {
                throw new Error(
                    `Заполните обязательные поля: ${missingFields.join(', ')}`
                );
            }

            const experimentId = await saveExperimentInfo({
                experimentDate: data.experimentDate,
                description: data.description,
                reportFile: data.reportFile,
                responsibleOperator: data.responsibleOperator,
                recordCreator: data.recordCreator,
                operators: data.operators,
                selectedLocation: data.selectedLocation,
            });

            onChange({
                ...data,
                experimentId: experimentId
            })

            onNext();
        } catch (error) {
            console.error('Save error:', error);
            alert(error instanceof Error ? error.message : 'Ошибка сохранения');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locations, operators] = await Promise.all([
                    getLocations(),
                    getOperators(),
                ]);
                console.log('Операторы и локации получены')
                onChange({
                    ...data,
                    availableLocations: locations,
                    availableOperators: operators,
                    location: data.locations || '',
                    operators: data.operators || [],
                });

                setLoading({ locations: false, operators: false });
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                setLoading({ locations: false, operators: false });
            }
        };

        fetchData();
    }, []);

    return (
        <Container>
            <h2 className="mb-4">Общая информация об испытании</h2>
            <Card className="text-start">
                <Card.Body>
                    <ExperimentBaseForm
                        data={{
                            ...data,
                            loadingLocations: loading.locations,
                            loadingOperators: loading.operators,
                        }}
                        onChange={(newData) => {
                            onChange({
                                ...newData,
                            });
                        }}
                        shouldHighlightError={shouldHighlightError}
                        markFieldAsTouched={markFieldAsTouched}
                        touchedFields={touchedFields}
                    />

                    <div className="d-flex justify-content-between mt-4">
                        <Button
                            variant="outline-danger"
                            onClick={handleCancel}
                            size="lg"
                            disabled={isSubmitting}
                        >
                            Отменить
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleNextWithSave}
                            size="lg"
                        >
                            {isSubmitting ? 'Сохранение...' : 'Далее'}
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ExperimentInfo;
