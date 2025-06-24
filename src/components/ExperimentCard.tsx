import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { TestEntry } from '../types/OtherTypes';

const TestCard: React.FC<TestEntry> = ({
    creationDate,
    testDate,
    description,
    location,
    equipment
}) => {
    return (
        <Card
            className="mb-3"
            style={{
                width: '100%',
                textAlign: 'left',
            }}
        >
            <Card.Body>
                <ListGroup
                    variant="flush"
                    style={{ backgroundColor: 'transparent' }}
                >
                    <ListGroup.Item
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                        }}
                    >
                        <strong>Дата создания:</strong> {creationDate}
                    </ListGroup.Item>
                    <ListGroup.Item
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                        }}
                    >
                        <strong>Дата испытания:</strong> {testDate}
                    </ListGroup.Item>
                    <ListGroup.Item
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                        }}
                    >
                        <strong>Краткое описание:</strong> {description}
                    </ListGroup.Item>
                    <ListGroup.Item
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                        }}
                    >
                        <strong>Место:</strong> {location}
                    </ListGroup.Item>
                    <ListGroup.Item
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                        }}
                    >
                        <strong>Аппараты:</strong> {equipment}
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    );
};

export default TestCard;