import React from 'react';
import { Container, Button } from 'react-bootstrap';
import TestCard from '../components/ExperimentCard';
import { TestEntry } from '../types/PagesTypes';
import { useNavigate } from 'react-router-dom';
import ExperimentCard from '../components/ExperimentCard';

interface HomePageProps {
    tests: TestEntry[];
    onAddTestClick: () => void;
    onDeleteTest: (id: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({
    tests,
    onAddTestClick,
    onDeleteTest,
}) => {
    const navigate = useNavigate();

    const handleViewExperiment = (test: TestEntry) => {
        navigate(`/test/${test.id}`, { state: { testData: test } });
    }
    return (
        <Container
            className="d-flex flex-column align-items-center py-4"
            style={{ minHeight: '100vh', backgroundColor: '#fff' }}
        >
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
                    tests.map((test) => (
                        <ExperimentCard
                            key={test.id}
                            {...test}
                            onDelete={() => onDeleteTest(test.id)}
                            onView={() => handleViewExperiment(test)}
                        />
                    ))
                )}
            </div>
        </Container>
    );
};

export default HomePage;
