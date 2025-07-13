import React, { useState, useEffect } from 'react';
import { Container, Button, Alert, Spinner } from 'react-bootstrap';
import { TestEntry } from '../types/PagesTypes';
import { useNavigate } from 'react-router-dom';
import ExperimentCard from '../components/ExperimentCard';

interface HomePageProps {
    tests: TestEntry[];
    onAddTestClick: () => void;
    onDeleteExperiment: (id: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({
    tests,
    onAddTestClick,
    onDeleteExperiment,
}) => {
    const navigate = useNavigate();
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
        {}
    );
    const [errorStates, setErrorStates] = useState<Record<string, string>>({});
    const [cardsData, setCardsData] = useState<Record<string, any>>({});

    useEffect(() => {
        tests.forEach((test) => {
            loadCardData(test.id);
        });
    }, [tests]);

    const loadCardData = async (experimentId: string) => {
        setLoadingStates((prev) => ({ ...prev, [experimentId]: true }));
        setErrorStates((prev) => ({ ...prev, [experimentId]: '' }));

        try {
            console.log(`Fetching /api/experiment/${experimentId}`);
            const response = await fetch(
                `http://192.168.1.106:5000/api/experiment/${experimentId}`
            );
            console.log('Response status: ', response.status);

            if (!response.ok) throw new Error('Ошибка загрузки данных');

            const data = await response.json();
            setCardsData((prev) => ({ ...prev, [experimentId]: data }));
        } catch (err: unknown) {
            setErrorStates((prev) => ({
                ...prev,
                [experimentId]:
                    err instanceof Error ? err.message : 'Неизвестная ошибка',
            }));
        } finally {
            setLoadingStates((prev) => ({ ...prev, [experimentId]: false }));
        }
    };

    const handleViewExperiment = (test: TestEntry) => {
        navigate(`/experiment/${test.id}`, { state: { testData: test } });
    };

    console.log('Check cardData: ', cardsData);


    return (
        <Container className="d-flex flex-column align-items-center py-4">
            <Button
                variant="dark"
                size="lg"
                className="custom-hover-button mb-4"
                onClick={onAddTestClick}
                style={{ width: '70%' }}
            >
                Добавить новое испытание
            </Button>

            <div
                style={{
                    width: '70%',
                    borderRadius: '8px',
                    padding: '1rem',
                    border: '1px solid rgb(203, 203, 203)',
                }}
            >
                {tests.length === 0 ? (
                    <p
                        style={{
                            margin: '0 0 0 1rem',
                            fontSize: '20px',
                            textAlign: 'left',
                        }}
                    >
                        Записей об испытаниях нет
                    </p>
                ) : (
                    tests.map((test) => {
                        const isLoading = loadingStates[test.id];
                        const error = errorStates[test.id];
                        const cardData = cardsData[test.id];

                        return (
                            <div key={test.id} className="mb-3">
                                {isLoading && (
                                    <Spinner animation="border" size="sm" />
                                )}
                                {error && (
                                    <Alert variant="danger">{error}</Alert>
                                )}

                                {!isLoading && !error && cardData && (
                                    <ExperimentCard
                                        id={test.id}
                                        creationDate={test.creationDate}
                                        testDate={cardData.testDate}
                                        description={cardData.description}
                                        location={cardData.location}
                                        equipment={cardData.equipment}
                                        onDelete={() => onDeleteExperiment(test.id)}
                                        onView={() =>
                                            handleViewExperiment(test)
                                        }
                                    />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </Container>
    );
};

export default HomePage;
