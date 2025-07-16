import React from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { SingleSelectProps, SelectItem } from '../types/ExperimentInfoTypes';

const SingleSelect: React.FC<SingleSelectProps & { name?: string }> = ({
    items,
    selectedItem,
    onSelectionChange,
    loading = false,
    name = 'single-select',
}) => {
    const handleSelect = (item: SelectItem) => {
        onSelectionChange(item);
    };

    if (loading) {
        return <div className="text-center my-3">Загрузка данных...</div>;
    }

    return (
        <div className="single-select">
            <ListGroup>
                {items.map((item) => (
                    <ListGroup.Item
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.75rem 1.25rem',
                            userSelect: 'none',
                        }}
                    >
                        <Form.Check
                            type="radio"
                            id={`${name}-${item.id}`}
                            name={name}
                            checked={selectedItem?.id === item.id}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                            className="me-2"
                            style={{ pointerEvents: 'none' }}
                            label="" // Убираем дублирующийся текст
                        />
                        {item.label}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default SingleSelect;
