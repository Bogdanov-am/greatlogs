// components/LocationSelect.tsx
import React from 'react';
import SingleSelect from '../SingleSelect';
import { SelectItem } from '../../types/ExperimentInfoFormTypes';

interface LocationSelectProps {
    locations: SelectItem[];
    selectedLocation: SelectItem | null;
    onLocationChange: (location: SelectItem | null) => void;
    loading?: boolean;
    error?: boolean;
    onBlur?: () => void;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
    locations,
    selectedLocation,
    onLocationChange,
    loading = false,
    error = false,
}) => {
    return (
        <div className="location-select">
            <h5 style={{ color: error ? 'red' : '' }}>Выберите локацию</h5>
            <div
            >
                <SingleSelect
                    items={locations}
                    selectedItem={selectedLocation}
                    onSelectionChange={onLocationChange}
                    loading={loading}
                    name="location"
                />
            </div>
        </div>
    );
};

export default LocationSelect;
