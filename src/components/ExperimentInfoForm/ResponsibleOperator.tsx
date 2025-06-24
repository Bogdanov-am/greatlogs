// components/ResponsibleOperatorSelect.tsx
import React from 'react';
import SingleSelect from '../SingleSelect';
import { SelectItem } from '../../types/ExperimentInfoFormTypes';

interface ResponsibleOperatorSelectProps {
    operators: SelectItem[];
    selectedOperator: SelectItem | null;
    onOperatorChange: (operator: SelectItem | null) => void;
    loading?: boolean;
    error?: boolean;
    onBlur?: () => void;
}

const ResponsibleOperatorSelect: React.FC<ResponsibleOperatorSelectProps> = ({
    operators,
    selectedOperator,
    onOperatorChange,
    loading = false,
    error = false,
}) => {
    return (
        <div className="responsible-operator-select h-100">
            <h5 className="mb-2 text-center" style={{ color: error ? 'red' : '', minHeight: '24px' }}>
                Ответственный
            </h5>
            <div className="flex-grow-1">
                {operators.length === 0 ? (
                    <div className="text-muted form-control">Отметьте операторов</div>
                ) : (
                    <SingleSelect
                        items={operators}
                        selectedItem={selectedOperator}
                        onSelectionChange={onOperatorChange}
                        loading={loading}
                        name="responsible-operator"
                    />
                )}
            </div>
        </div>
    );
};

export default ResponsibleOperatorSelect;
