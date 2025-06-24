import React from 'react';
import MultiSelect from '../MultiSelect';
import { SelectItem } from '../../types/ExperimentInfoFormTypes';

interface OperatorsMultiSelectProps {
    operators: SelectItem[];
    selectedOperators: SelectItem[];
    onOperatorsChange: (operators: SelectItem[]) => void;
    loading?: boolean;
    error?: boolean;
    onBlur?: () => void;
}

const OperatorsMultiSelect: React.FC<OperatorsMultiSelectProps> = ({
    operators,
    selectedOperators,
    onOperatorsChange,
    loading = false,
    error = false,
    onBlur
}) => {
    return (
        <div className="operators-select h-100">
            <h5 className="mb-2 text-center" style={{ color: error ? 'red' : '', minHeight: '24px' }}>Операторы испытания</h5>
            <div className="flex-grow-1">
                <MultiSelect
                    items={operators}
                    selectedItems={selectedOperators}
                    onSelectionChange={onOperatorsChange}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default OperatorsMultiSelect;
