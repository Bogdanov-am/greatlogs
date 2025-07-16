import React from 'react';
import SingleSelect from '../SingleSelect';
import { SelectItem } from '../../types/ExperimentInfoTypes';

interface CreatorSelectProps {
    operators: SelectItem[];
    selectedCreator: SelectItem | null;
    onCreatorChange: (creator: SelectItem | null) => void;
    loading?: boolean;
    error?: boolean;
    onBlur?: () => void;
}

const CreatorSelect: React.FC<CreatorSelectProps> = ({
    operators,
    selectedCreator,
    onCreatorChange,
    loading = false,
    error = false,
}) => {
    const sortedOperators = [...operators].sort((a, b) =>
        a.label.localeCompare(b.label, 'ru', { sensitivity: 'base' })
    );

    return (
        <div className="record-creator-select h-100">
            <h5
                className="mb-2 text-center"
                style={{ color: error ? 'red' : '', minHeight: '24px' }}
            >
                Составил запись
            </h5>
            <div className="flex-grow-1">
                {operators.length === 0 ? (
                    <div className="text-muted form-control">
                        Отметьте операторов
                    </div>
                ) : (
                    <SingleSelect
                        items={sortedOperators}
                        selectedItem={selectedCreator}
                        onSelectionChange={onCreatorChange}
                        loading={loading}
                        name="record-creator"
                    />
                )}
            </div>
        </div>
    );
};

export default CreatorSelect;
