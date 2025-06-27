import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { TestEntry } from '../types/PagesTypes';

interface ExperimentCardProps extends TestEntry {
    onDelete: () => void;
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({
    creationDate,
    testDate,
    description,
    location,
    equipment,
    onDelete,
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
                <Button variant="danger" onClick={onDelete} className="mb-3">
                    Удалить
                </Button>
            </Card.Body>
        </Card>
    );
};

export default ExperimentCard;
