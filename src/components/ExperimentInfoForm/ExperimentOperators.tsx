import React, { useState, useEffect, useRef } from 'react';
import MultiSelect from '../MultiSelect';
import { SelectItem } from '../../types/ExperimentInfoTypes';
import { Form } from 'react-bootstrap';

interface OperatorsMultiSelectProps {
    operators: SelectItem[];
    selectedOperators: SelectItem[];
    onOperatorsChange: (operators: SelectItem[]) => void;
    loading?: boolean;
    required?: boolean;
    onBlur?: () => void;
    initialTouched?: boolean;
}

const OperatorsMultiSelect: React.FC<OperatorsMultiSelectProps> = ({
    operators,
    selectedOperators,
    onOperatorsChange,
    loading = false,
    required = true,
    onBlur,
    initialTouched = false,
}) => {
    const [isTouched, setIsTouched] = useState(initialTouched);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Показывать ошибку только если поле тронуто И не выбрано ни одного оператора
    const showError = required && isTouched && selectedOperators.length === 0;

    // Помечаем поле как "тронутое" при любом взаимодействии
    const handleInteraction = () => {
        if (!isTouched) {
            setIsTouched(true);
        }
    };

    // Обработчик изменений с отметкой взаимодействия
    const handleSelectionChange = (ops: SelectItem[]) => {
        handleInteraction();
        onOperatorsChange(ops);
    };

    // Обработчик потери фокуса
    const handleBlur = (e: React.FocusEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(e.relatedTarget as Node)
        ) {
            handleInteraction();
            onBlur?.();
        }
    };

    const sortedOperators = [...operators].sort((a, b) =>
        a.label.localeCompare(b.label, 'ru', { sensitivity: 'base' })
    );

    return (
        <Form.Group className="operators-select">
            <Form.Label className="d-block">
                <h5 style={{ color: showError ? 'red' : '' }}>
                    Операторы испытания
                </h5>
            </Form.Label>
            <div
                ref={dropdownRef}
                onBlur={handleBlur}
                tabIndex={-1} // Для работы onBlur
            >
                <MultiSelect
                    items={sortedOperators}
                    selectedItems={selectedOperators}
                    onSelectionChange={handleSelectionChange}
                    loading={loading}
                />
            </div>
            {/* {showError && (
                <Form.Text className="text-danger">
                    Необходимо выбрать хотя бы одного оператора
                </Form.Text>
            )} */}
        </Form.Group>
    );
};

export default OperatorsMultiSelect;
