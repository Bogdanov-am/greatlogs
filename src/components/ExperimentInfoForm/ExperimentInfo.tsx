import React, { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import {
    ExperimentInfoProps,
    SelectItem,
} from '../../types/ExperimentInfoTypes';
import ExperimentBaseForm from './ExperimentBaseForm';
import ActionButtons from '../ActionButtons';

// import { fetchLocations, fetchOperators } from '../../api';

// Добавляем функции для загрузки данных (замените на реальные API-вызовы)

const fetchLocations = async (): Promise<SelectItem[]> => {
    // Замените на реальный запрос к API
    return [
        { id: 1, label: 'Санкт-Петербург' },
        { id: 2, label: 'Кронштадт' },
        { id: 3, label: 'Архангельск' },
        { id: 4, label: 'Анапа' },
    ];
};

const fetchOperators = async (): Promise<SelectItem[]> => {
    // Замените на реальный запрос к API
    return [
        { id: 1, label: 'Шиляев Я.Д.' },
        { id: 2, label: 'Рыков А.Д.' },
        { id: 3, label: 'Кирковров Ф.Б.' },
        { id: 4, label: 'Билан Б.М.' },
        { id: 5, label: 'Мусагалиев А.Т.' },
        { id: 6, label: 'Дорохов Д.Д.' },
        { id: 7, label: 'Михайлов С.М.' },
        { id: 8, label: 'Сиек Ю.Л.' },
        { id: 9, label: 'Пак А.Д.' },
        { id: 10, label: 'Ницше Ф.В.' },
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
    touchedFields,
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

                    <ActionButtons onBack={onBack} onNext={onNext} />
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ExperimentInfo;
