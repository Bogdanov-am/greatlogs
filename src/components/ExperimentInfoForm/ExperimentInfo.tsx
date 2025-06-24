import React, { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import {
    ExperimentInfoProps,
    SelectItem,
} from '../../types/ExperimentInfoFormTypes';
import ExperimentBaseForm from './ExperimentBaseForm';
import ActionButtons from '../ActionButtons';

// Добавляем функции для загрузки данных (замените на реальные API-вызовы)
const fetchLocations = async (): Promise<SelectItem[]> => {
    // Замените на реальный запрос к API
    return [
        { id: 1, label: 'Локация A' },
        { id: 2, label: 'Локация B' },
    ];
};

const fetchOperators = async (): Promise<SelectItem[]> => {
    // Замените на реальный запрос к API
    return [
        { id: 1, label: 'Оператор 1' },
        { id: 2, label: 'Оператор 2' },
    ];
};

const ExperimentInfo: React.FC<
    ExperimentInfoProps & {
        shouldHighlightError: (fieldName: string, value: any) => boolean;
        markFieldAsTouched: (fieldName: string) => void;
    }
> = ({
    data,
    onChange,
    onBack,
    onNext,
    shouldHighlightError,
    markFieldAsTouched,
}) => {
    const [loading, setLoading] = useState({
        locations: true,
        operators: true,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locations, operators] = await Promise.all([
                    fetchLocations(),
                    fetchOperators(),
                ]);

                onChange({
                    ...data,
                    availableLocations: locations,
                    availableOperators: operators,
                    location: data.locations || '',
                    operators: data.operators || [],
                    responsibleOperator: null,
                    recordCreator: null,
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
                    />

                    <ActionButtons onBack={onBack} onNext={onNext} />
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ExperimentInfo;
