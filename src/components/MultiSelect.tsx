import React from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import {
    MultiSelectProps,
    SelectItem,
} from '../types/ExperimentInfoFormTypes';

const MultiSelect: React.FC<MultiSelectProps> = ({
    items,
    selectedItems,
    onSelectionChange,
    loading = false,
}) => {
    const handleSelect = (item: SelectItem) => {
        const isSelected = selectedItems.some(
            (selected) => selected.id === item.id
        );
        if (isSelected) {
            onSelectionChange(
                selectedItems.filter((selected) => selected.id !== item.id)
            );
        } else {
            onSelectionChange([...selectedItems, item]);
        }
    };

    if (loading) {
        return <div className="text-center my-3">Загрузка данных...</div>;
    }

    return (
        <div className="multi-select">
            <ListGroup>
                {items.map((item) => (
                    <ListGroup.Item
                        key={item.id}
                        action
                    >
                        <Form.Check
                            type="checkbox"
                            id={`multi-select-${item.id}`}
                            label={item.label}
                            checked={selectedItems.some(
                                (selected) => selected.id === item.id
                            )}
                            onChange={() => handleSelect(item)}
                        />
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default MultiSelect;
