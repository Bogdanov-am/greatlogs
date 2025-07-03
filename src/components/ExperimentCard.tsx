import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { TestEntry } from '../types/PagesTypes';

interface ExperimentCardProps extends TestEntry {
    onDelete: () => void;
    onView: () => void;
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({
    creationDate,
    testDate,
    description,
    location,
    equipment,
    onDelete,
    onView
}) => {
    return (
        <Card className="mb-3" style={{ width: '100%', textAlign: 'left' }}>
            <Card.Body>
                <Card.Title>Запись от {creationDate}</Card.Title>
                <Card.Text>
                    <strong>Дата испытания: </strong>
                    {testDate}
                    <br />
                    <strong>Описание: </strong>
                    {description}
                    <br />
                    <strong>Локация: </strong>
                    {location}
                    <br />
                    <strong>Аппараты: </strong>
                    {equipment}
                </Card.Text>
                <div className="d-flex gap-2">
                    <Button variant="outline-info" onClick={onView} className="mb-3">
                        Посмотреть
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onDelete}
                        className="mb-3"
                    >
                        Удалить
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ExperimentCard;
