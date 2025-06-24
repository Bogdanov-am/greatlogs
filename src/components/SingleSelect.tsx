import React from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import {
    SingleSelectProps,
    SelectItem,
} from '../types/ExperimentInfoFormTypes';

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
        <div
            className="single-select"
        >
            <ListGroup>
                {items.map((item) => (
                    <ListGroup.Item
                        key={item.id}
                        action
                    >
                        <Form.Check
                            type="radio"
                            id={`${name}-${item.id}`}
                            name={name}
                            label={item.label}
                            checked={selectedItem?.id === item.id}
                            onChange={() => handleSelect(item)}
                        />
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default SingleSelect;
